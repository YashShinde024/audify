/**
 * Audify Audio Processing Completion Sound System
 *
 * Provides a minimal, original, subtle completion notification synthesized
 * entirely on-the-fly via the Web Audio API (zero audio file dependencies).
 *
 * Sound design:
 *   - Luminous D-Major triad arpeggio (D5 587.3 Hz -> F#5 739.9 Hz -> A5 880.0 Hz).
 *   - Total duration: ~220 ms.
 *   - Soft sinusoidal envelope with gentle 4 ms attack and smooth exponential decay.
 *   - Warm Butterworth lowpass smoothing (cutoff 2400 Hz) to eliminate harsh high-frequency beeps.
 *   - Low master gain (~0.08 peak) for non-intrusive notification.
 *
 * Safety & ergonomics:
 *   - Respects browser autoplay restrictions.
 *   - Reuses AudioContext safely.
 *   - Gracefully no-ops if Web Audio is unsupported.
 *   - Duplicate suppression guards against React Strict Mode re-renders and rapid triggers.
 *   - Persistent preference stored in localStorage (`audify-completion-sound`, default: false).
 *   - Toggling preference dispatches window event for instant UI synchronization.
 */

export const COMPLETION_SOUND_STORAGE_KEY = "audify-completion-sound";
export const COMPLETION_SOUND_EVENT = "audify:completion-sound-preference";

let sharedAudioContext: AudioContext | null = null;
let lastPlayTimestamp = 0;
const playedTokens = new Set<string>();
const DEBOUNCE_INTERVAL_MS = 600;

function getTargetStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  if (typeof localStorage !== "undefined") return localStorage;
  return null;
}

function getEventTarget(): EventTarget | null {
  if (typeof window !== "undefined") return window;
  if (typeof globalThis !== "undefined" && "dispatchEvent" in globalThis) {
    return globalThis as unknown as EventTarget;
  }
  return null;
}

/**
 * Returns whether the completion sound is enabled.
 * Sensible default is FALSE (opt-in) until the user explicitly enables it.
 */
export function isCompletionSoundEnabled(): boolean {
  const storage = getTargetStorage();
  if (!storage) return false;
  try {
    return storage.getItem(COMPLETION_SOUND_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Updates the user's completion sound preference and notifies active listeners.
 */
export function setCompletionSoundEnabled(enabled: boolean): void {
  const storage = getTargetStorage();
  if (storage) {
    try {
      storage.setItem(COMPLETION_SOUND_STORAGE_KEY, enabled ? "true" : "false");
    } catch {
      // LocalStorage quota or access error handled gracefully
    }
  }

  const target = getEventTarget();
  if (target) {
    try {
      target.dispatchEvent(
        new CustomEvent(COMPLETION_SOUND_EVENT, { detail: { enabled } })
      );
    } catch {
      // Event dispatch error handled gracefully
    }
  }
}

/**
 * Gets or initializes a reusable AudioContext for completion sounds.
 */
function getNotificationAudioContext(): AudioContext | null {
  const AudioContextClass =
    (typeof window !== "undefined" && (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)) ||
    (typeof globalThis !== "undefined" && ((globalThis as unknown as { AudioContext?: typeof AudioContext }).AudioContext || (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext));

  if (!AudioContextClass) return null;

  try {
    if (!sharedAudioContext || sharedAudioContext.state === "closed") {
      sharedAudioContext = new AudioContextClass();
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
}

/**
 * Synthesizes and plays the Audify signature completion sound chime.
 * Internal helper: does not check user preference so it can power previews.
 */
async function synthesizeChime(ctx: AudioContext): Promise<boolean> {
  try {
    if (ctx.state === "suspended") {
      await ctx.resume().catch(() => {
        // Autoplay policy prevented resume
      });
    }

    if (ctx.state !== "running") {
      return false;
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(1.0, now);

    masterGain.gain.setValueAtTime(0.08, now);
    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Three gentle ascending tones: D5 (587.33 Hz), F#5 (739.99 Hz), A5 (880.00 Hz)
    const tones = [
      { freq: 587.33, startOffset: 0.0, duration: 0.08, peak: 0.07 },
      { freq: 739.99, startOffset: 0.055, duration: 0.085, peak: 0.08 },
      { freq: 880.0, startOffset: 0.11, duration: 0.11, peak: 0.075 },
    ];

    tones.forEach(({ freq, startOffset, duration, peak }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + startOffset);

      // Smooth cosine / exponential envelope to avoid clicks
      const startTime = now + startOffset;
      const attackEnd = startTime + 0.006;
      const endTime = startTime + duration;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(peak, attackEnd);
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(endTime);
    });

    return true;
  } catch {
    // Audio synthesis failure swallowed silently so processing is never disrupted
    return false;
  }
}

/**
 * Plays the completion sound when a processing task finishes.
 * Checks user preference, enforces debounce and token deduplication.
 * Returns true if sound was successfully triggered, false otherwise.
 */
export async function playCompletionSound(triggerToken?: string): Promise<boolean> {
  if (!isCompletionSoundEnabled()) {
    return false;
  }

  // Duplicate suppression
  const now = Date.now();
  if (now - lastPlayTimestamp < DEBOUNCE_INTERVAL_MS) {
    return false;
  }

  if (triggerToken) {
    if (playedTokens.has(triggerToken)) {
      return false;
    }
    playedTokens.add(triggerToken);
    // Prune token set if too large
    if (playedTokens.size > 100) {
      playedTokens.clear();
      playedTokens.add(triggerToken);
    }
  }

  lastPlayTimestamp = now;

  const ctx = getNotificationAudioContext();
  if (!ctx) return false;

  return synthesizeChime(ctx);
}

/**
 * Plays a preview of the completion sound, regardless of whether the preference
 * is currently toggled on. Used for the preview button in settings.
 */
export async function previewCompletionSound(): Promise<boolean> {
  const ctx = getNotificationAudioContext();
  if (!ctx) return false;
  return synthesizeChime(ctx);
}

/**
 * Resets internal deduplication state and active context (useful for test suites).
 */
export function resetCompletionSoundState(): void {
  lastPlayTimestamp = 0;
  playedTokens.clear();
  sharedAudioContext = null;
}

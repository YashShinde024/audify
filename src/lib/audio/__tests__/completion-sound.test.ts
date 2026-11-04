import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  COMPLETION_SOUND_EVENT,
  COMPLETION_SOUND_STORAGE_KEY,
  isCompletionSoundEnabled,
  setCompletionSoundEnabled,
  playCompletionSound,
  previewCompletionSound,
  resetCompletionSoundState,
} from "../completion-sound";

describe("Completion Sound System", () => {
  let mockStorage: Record<string, string> = {};
  let eventTarget: EventTarget;

  beforeEach(() => {
    resetCompletionSoundState();
    mockStorage = {};
    eventTarget = new EventTarget();

    const mockStorageObj = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, val: string) => {
        mockStorage[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
    };

    vi.stubGlobal("localStorage", mockStorageObj);
    vi.stubGlobal("window", {
      addEventListener: eventTarget.addEventListener.bind(eventTarget),
      removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
      dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
      localStorage: mockStorageObj,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Preference Persistence & Defaults", () => {
    it("defaults to false (disabled) when no stored value exists", () => {
      expect(isCompletionSoundEnabled()).toBe(false);
    });

    it("persists enabled state to localStorage when set to true", () => {
      setCompletionSoundEnabled(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(COMPLETION_SOUND_STORAGE_KEY, "true");
      expect(isCompletionSoundEnabled()).toBe(true);
    });

    it("persists disabled state when toggled back to false", () => {
      setCompletionSoundEnabled(true);
      expect(isCompletionSoundEnabled()).toBe(true);

      setCompletionSoundEnabled(false);
      expect(localStorage.setItem).toHaveBeenCalledWith(COMPLETION_SOUND_STORAGE_KEY, "false");
      expect(isCompletionSoundEnabled()).toBe(false);
    });

    it("dispatches window event with the updated preference value", () => {
      const listener = vi.fn();
      window.addEventListener(COMPLETION_SOUND_EVENT, listener);

      setCompletionSoundEnabled(true);
      expect(listener).toHaveBeenCalledTimes(1);

      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({ enabled: true });

      window.removeEventListener(COMPLETION_SOUND_EVENT, listener);
    });
  });

  describe("Disabled Behavior & Safety", () => {
    it("does not play or initialize audio when disabled", async () => {
      setCompletionSoundEnabled(false);
      const played = await playCompletionSound("test-task-1");
      expect(played).toBe(false);
    });

    it("survives gracefully when window or AudioContext is absent or throws", async () => {
      setCompletionSoundEnabled(true);
      vi.stubGlobal("AudioContext", undefined);

      const played = await playCompletionSound("test-task-2");
      expect(played).toBe(false);
    });
  });

  describe("Duplicate Suppression & Debouncing", () => {
    it("suppresses rapid duplicate calls within debounce interval", async () => {
      setCompletionSoundEnabled(true);

      // Mock functional AudioContext
      const mockOsc = {
        type: "sine",
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      const mockGain = {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
      const mockFilter = {
        type: "lowpass",
        frequency: { setValueAtTime: vi.fn() },
        Q: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
      };

      const mockCtx = {
        state: "running",
        currentTime: 0,
        destination: {},
        createOscillator: vi.fn(() => mockOsc),
        createGain: vi.fn(() => mockGain),
        createBiquadFilter: vi.fn(() => mockFilter),
        resume: vi.fn().mockResolvedValue(undefined),
      };

      vi.stubGlobal("AudioContext", vi.fn(() => mockCtx));

      // First call should succeed
      const first = await playCompletionSound("task-token-1");
      expect(first).toBe(true);

      // Immediate second call should be debounced
      const second = await playCompletionSound("task-token-2");
      expect(second).toBe(false);
    });

    it("suppresses repeated invocations with the same token", async () => {
      setCompletionSoundEnabled(true);

      const mockCtx = {
        state: "running",
        currentTime: 0,
        destination: {},
        createOscillator: vi.fn(() => ({
          type: "sine",
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        })),
        createGain: vi.fn(() => ({
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        })),
        createBiquadFilter: vi.fn(() => ({
          type: "lowpass",
          frequency: { setValueAtTime: vi.fn() },
          Q: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
        })),
        resume: vi.fn().mockResolvedValue(undefined),
      };

      vi.stubGlobal("AudioContext", vi.fn(() => mockCtx));

      const first = await playCompletionSound("unique-run-99");
      expect(first).toBe(true);

      // Second call with same token should still be blocked even if later
      const second = await playCompletionSound("unique-run-99");
      expect(second).toBe(false);
    });
  });

  describe("Preview Playback", () => {
    it("plays sound preview even when user preference is disabled", async () => {
      setCompletionSoundEnabled(false);
      expect(isCompletionSoundEnabled()).toBe(false);

      const mockCtx = {
        state: "running",
        currentTime: 0,
        destination: {},
        createOscillator: vi.fn(() => ({
          type: "sine",
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        })),
        createGain: vi.fn(() => ({
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        })),
        createBiquadFilter: vi.fn(() => ({
          type: "lowpass",
          frequency: { setValueAtTime: vi.fn() },
          Q: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
        })),
        resume: vi.fn().mockResolvedValue(undefined),
      };

      vi.stubGlobal("AudioContext", vi.fn(() => mockCtx));

      const previewed = await previewCompletionSound();
      expect(previewed).toBe(true);
      expect(mockCtx.createOscillator).toHaveBeenCalled();
    });
  });
});

# Performance & Resource Management

Audify is designed to deliver studio-quality audio processing while running smoothly on resource-constrained mobile phones, tablets, and laptops.

---

## 1. Client Memory Architecture (10 MB Ceiling)

Audio files are decompressed from lossy/compressed formats into 32-bit linear PCM float arrays in browser RAM:
- A 5-minute stereo audio track at 44.1 kHz requires:
  $$5 \times 60 \times 44100 \times 2 \times 4\text{ bytes} \approx 105.8\text{ MB of raw RAM}$$
- A 10 MB compressed MP3 can easily decompress into over 100 MB of uncompressed float data.
- **Protection:** Audify enforces a hard **10 MB ingestion ceiling** (`siteConfig.maxFileSizeBytes`). Files exceeding this size are rejected at ingestion with a clear explanatory error before memory allocation occurs, preventing mobile browser tab crashes.

---

## 2. Audio Node Cleanup & Garbage Collection

To prevent long-term memory leaks during prolonged studio sessions:
- Temporary Blob URLs generated for auditioning or exports (`URL.createObjectURL`) are tracked and revoked (`URL.revokeObjectURL`) when a new file or preset is selected.
- Inactive Web Audio nodes are disconnected (`node.disconnect()`) when resetting the signal chain.
- `OfflineAudioContext` instances are instantiated on-demand per render and naturally garbage-collected after completion.

---

## 3. Coordinated HTML5 Canvas Rendering

Audify renders gentle harmonic background ambient waves (`src/components/marketing/wave-field.tsx`):
- Uses a single coordinated `requestAnimationFrame` loop.
- Respects `prefers-reduced-motion` preferences: disables animations or freezes wave motion when the user requests reduced motion.
- Throttles rendering during tab invisibility (`document.visibilityState === "hidden"`) to conserve battery on mobile devices.

# Privacy & Security Model

Audify is built on a **zero-server privacy architecture**. This document explains the exact technical guarantees and data flow boundaries that safeguard user privacy.

---

## 1. Zero-Server Audio Processing Contract

Unlike traditional cloud converters that upload your audio files to remote servers, Audify processes everything directly in your device's browser memory:

1. **No Audio Transmission:** No audio bytes, waveforms, spectral slices, or transcripts are ever transmitted over the network.
2. **Volatile RAM Only:** Audio files exist only as temporary `AudioBuffer` objects in your browser tab's volatile RAM.
3. **Automatic Cleanup:** Closing or refreshing the tab completely purges all audio data from memory.
4. **Revocable Object URLs:** Previews and export downloads utilize client-side Blobs (`URL.createObjectURL`), which are destroyed via `URL.revokeObjectURL` after use.

---

## 2. Telemetry, Cookies & Local Storage

- **Zero Audio Fingerprinting:** No audio identification or acoustic fingerprinting algorithms run against user tracks.
- **GDPR & CCPA Compliant Cookie Banner:** Audify uses essential storage for theme preference and cookie consent. Non-essential tracking is strictly disabled by default.
- **Stored Local Data:**
  - `audify-theme`: `"dark"` or `"light"`.
  - `audify-cookie-consent`: Consent status.
  - `audify-custom-presets-v1`: User-created DSP slider values (stored locally on your device).

---

## 3. Server Endpoint Hardening (`/api/contact`)

The only server-side route in Audify is the optional contact dispatch endpoint:
- **Rate Limiting:** Enforces a sliding-window maximum of 5 requests per 10 minutes per client IP.
- **Honeypot Trap:** Automated spam bots are silently discarded.
- **IP Masking in Logs:** Client IPs are masked in stdout logs (`192.168.*.*`) and contain zero personal details.

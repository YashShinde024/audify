# Troubleshooting

This guide addresses common development, build, audio playback, and runtime issues.

---

## 1. Development & Installation Issues

### Port 3000 is Already in Use
```text
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Specify an alternate port for the Next.js dev server:
```bash
npm run dev -- -p 3001
```

### PowerShell Command Sequencing Error
```text
The token '&&' is not a valid statement separator in this version.
```
**Solution:** In Windows PowerShell, use `;` instead of `&&` to sequence commands:
```powershell
npx tsc --noEmit; npm test
```

### Module Resolution Warning
```text
Warning: Module type of file ... is not specified and it doesn't parse as CommonJS.
```
**Solution:** When executing quick Node one-liners on `.ts` files, use `npx tsx` instead of raw `node` or supply the appropriate loader flag.

---

## 2. Browser Audio Issues

### Audio Does Not Play on First Click
**Cause:** Modern browsers (Safari, Chrome, Firefox) enforce strict autoplay restrictions preventing audio from playing without explicit user interaction.
**Solution:** Click or tap any transport control (Play button, volume fader, or timeline scrubber) to unlock the Web Audio `AudioContext`.

### Audio Stutters During Heavy Processing
**Cause:** Attempting to render heavy convolution reverbs in real-time on constrained mobile devices.
**Solution:** In the Studio, Audify uses `OfflineAudioContext` for rendering final masters. For live auditioning, reduce the buffer complexity or test with the dry/wet comparison toggle.

---

## 3. Build & TypeScript Errors

### Next.js Agent Rules & Turbopack Notice
Refer to `AGENTS.md` for Next.js 16 App Router conventions. When building for production, always test with:
```bash
npm run build
```
Turbopack builds will report route optimization statistics and identify unhandled dynamic parameter combinations.

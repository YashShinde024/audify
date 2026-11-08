# Contributing to Audify

Thank you for your interest in contributing to **Audify** (*Sound, reimagined* by Nyxen × Xpert Melody)!

This document outlines the workflow, coding standards, testing expectations, and contribution process.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment for all contributors. Please review our [Code of Conduct](./CODE_OF_CONDUCT.md). Instances of abusive or unacceptable behavior can be reported to **support@nyxen.in**.

---

## Development Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v9+)
- **Git**

### 2. Fork & Clone
```bash
git clone https://github.com/<your-username>/audify.git
cd audify
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Quality Gates

Every pull request must pass the automated quality gates before merging:

```bash
# 1. Typecheck the entire codebase
npx tsc --noEmit

# 2. Run the full unit & audio DSP test suite (Vitest)
npm test

# 3. Run the audio mathematical & DSP verification script
npx tsx scripts/verify-audio.ts

# 4. Run ESLint checks
npm run lint

# 5. Verify the production build compiles cleanly
npm run build
```

---

## Working Rules & Coding Conventions

### 1. Audio Processing & DSP
- **100% Client-Side:** Never introduce backend routes or services that upload, transmit, or store user audio.
- **AudioContext Safety:** Always use `OfflineAudioContext` for deterministic exports and ensure Web Audio nodes are disconnected and garbage-collected when no longer in use.
- **Limiter Protection:** Any signal chain exceeding 0 dBFS must be protected by the sliding-window soft-knee look-ahead peak limiter to prevent harsh digital clipping.
- **Immutable Presets:** Preset definitions in `src/config/presets.ts` must maintain strict mathematical integrity and include complete parameter definitions with sensible defaults.

### 2. Styling & Design System
- **Tailwind CSS v4:** Follow project conventions using `@theme inline` variables from `src/app/globals.css`.
- **Theme Parity:** Ensure every component renders correctly in both **Light (Quartz `#F8F7F5`)** and **Dark (Sonic `#111016`)** modes.
- **Conic Buttons:** Primary actions must use the rotating gradient utility `.btn-gradient-primary`.
- **Responsive Sizing:** Use mobile-first breakpoints (`xs:`, `sm:`, `md:`, `lg:`, `xl:`). Never use blunt global `overflow-x: hidden` to mask broken layout mathematics.
- **Input Auto-Zoom:** Always ensure text and search inputs have a base font size of at least `16px` on mobile (`text-[16px] sm:text-xs`) to prevent unwanted iOS Safari zooming.

### 3. State Management
- Global studio state is managed with **Zustand** in `src/stores/editor-store.ts`.
- Keep store actions pure and predictable. Use selectors when consuming store slices to prevent unnecessary re-renders during live audio playback.

---

## Adding a New Preset

To introduce a new creative preset or utility:

1. Open `src/config/presets.ts`.
2. Append a new `Preset` object adhering to the schema:
   ```typescript
   {
     id: "my-new-effect",
     name: "My New Effect",
     kind: "preset", // or "tool"
     category: "creative",
     description: "Clear, factual acoustic description.",
     supportedOps: ["BiquadFilter", "StereoPanner"],
     tags: ["tag1", "tag2"],
     params: [
       { id: "amount", label: "Effect Amount", kind: "slider", min: 0, max: 100, step: 1, unit: "%", description: "..." }
     ],
     defaults: { amount: 50 },
   }
   ```
3. Update `src/lib/audio/dsp-plan.ts` to implement the Web Audio node chain corresponding to the operations in `supportedOps`.
4. Add unit test coverage in `src/lib/audio/__tests__/dsp-plan.test.ts`.

---

## Pull Request Guidelines

1. **Branch Naming:**
   - `feat/feature-name`
   - `fix/bug-description`
   - `docs/documentation-topic`
2. **Commit Messages:** Follow conventional commits:
   - `feat(studio): add batch export format selector`
   - `fix(audio): resolve buffer length calculation in merger`
   - `docs(api): update contact endpoint specification`
3. **Pull Request Description:**
   - Summarize the changes made.
   - Specify the target viewports or browsers tested.
   - Provide test verification evidence.

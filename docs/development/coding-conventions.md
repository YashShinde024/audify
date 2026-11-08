# Coding Conventions

This document outlines the coding standards, patterns, and style conventions used across the Audify codebase.

---

## 1. General Principles

1. **Local-First Audio Contract:** Never transmit, upload, or process audio buffers on a server. All DSP processing belongs in client-side Web Audio code.
2. **Deterministic Layout Math:** Never apply blunt global `overflow-x: hidden` to mask broken layout math. Fix layout containers, flex wrapping, and responsive sizing at the root cause.
3. **Strict Type Safety:** Always enable and satisfy strict TypeScript checks (`npx tsc --noEmit` must pass with 0 errors).
4. **Theme Parity:** Every UI component must be styled for both **Light (Quartz)** and **Dark (Sonic)** modes.

---

## 2. TypeScript & React 19 Standards

- **Server vs Client Components:**
  - Components are React Server Components by default.
  - Add `"use client"` only when components require browser APIs, audio playback, event listeners, or hooks.
- **Props Interfaces:**
  - Define explicit interfaces for component props.
  - Use `ReactNode` from `react` for children.
- **Function Declarations:**
  - Prefer standard named function declarations for components: `export function ComponentName(props: ComponentProps)`.

---

## 3. Styling & Tailwind CSS v4

Audify uses **Tailwind CSS v4** with `@theme inline` variables defined in [`src/app/globals.css`](../../src/app/globals.css).

- **Colors:** Use semantic design tokens:
  - `bg-canvas`, `bg-surface`, `bg-raised`, `bg-deep`
  - `text-fg`, `text-muted`, `text-faint`, `text-primary`
  - `border-line`, `border-line-strong`
- **Buttons:**
  - Primary call-to-actions must use the rotating conic gradient: `btn-gradient-primary`.
- **Touch Accessibility:**
  - Minimum touch hit targets should be at least `40×40px` (ideally `44×44px`).
  - Add `touch-manipulation` to interactive controls.
- **Input Sizing:**
  - All text/search inputs must use `text-[16px] sm:text-xs` to prevent iOS Safari auto-zoom.

---

## 4. State Management with Zustand

- Global store is in [`src/stores/editor-store.ts`](../../src/stores/editor-store.ts).
- Consuming state:
  ```typescript
  // Recommended: Use atomic selector
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlay = useEditorStore((s) => s.togglePlay);

  // Avoid: Subscribing to the entire store object
  const store = useEditorStore();
  ```
- This ensures components do not re-render unnecessarily as audio playback timestamps update.

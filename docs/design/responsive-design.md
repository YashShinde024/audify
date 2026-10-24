# Responsive Design

Audify is engineered to function comfortably across all viewport sizes, from narrow mobile displays up to ultra-wide desktop monitors.

---

## 1. Supported Target Viewport Sizes

All application layouts are verified against representative viewport dimensions:

- **320 × 568** — Small phone (iPhone SE)
- **360 × 800** — Compact Android phone
- **390 × 844** — Modern smartphone (iPhone 12/13/14)
- **430 × 932** — Large smartphone (iPhone Pro Max)
- **768 × 1024** — Tablet portrait
- **1024 × 768** — Tablet landscape / Small laptop
- **1280 × 800** — Standard desktop display
- **1440 × 900+** — Large desktop display

---

## 2. Core Responsive Principles

### A. Mobile-First Architecture
Layouts begin with compact, readable single-column flows that expand gracefully to multi-column grids at larger breakpoints (`sm:`, `md:`, `lg:`, `xl:`).

### B. No Global `overflow-x: hidden` Crutches
Layout containers must calculate their widths correctly using `min-w-0`, flex shrink boundaries, and responsive grids. Global `overflow-x: hidden` is never used as an excuse to hide broken layout mathematics.

### C. Touch-Friendly Interactive Controls
- Transport buttons, menu toggles, and modal dismiss triggers maintain hit dimensions of at least `40×40px` (ideally `44×44px`).
- Interactive elements declare `touch-manipulation` to eliminate double-tap delay on mobile devices.

### D. iOS Auto-Zoom Prevention
Text inputs, search boxes, and prompt bars enforce `text-[16px] sm:text-xs`, ensuring iOS Safari does not zoom in upon input focus.

### E. Scrollable Horizontal Capsule Rails
Category pills and segmented mode switchers use `overflow-x-auto no-scrollbar max-w-full sm:flex-wrap`, providing swipeable rails on mobile devices without vertical clutter.

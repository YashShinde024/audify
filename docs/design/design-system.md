# Design System: Quartz & Sonic

Audify's visual identity balances the precision of professional Digital Audio Workstations (DAWs) with the editorial elegance of modern web design.

**Brand:** Audify by Nyxen × Xpert Melody  
**Tagline:** *Sound, reimagined.*

---

## 1. Color Palette & Surfaces

Audify maintains strict parity between light and dark themes.

### Light Mode (Quartz)
- **Canvas (`--color-canvas`):** `#F8F7F5` (Warm Quartz)
- **Surface (`--color-surface`):** `#FFFFFF` (Crisp White Card)
- **Raised (`--color-raised`):** `#F0EDE8`
- **Deep (`--color-deep`):** `#EAE6DF`
- **Text Primary (`--color-fg`):** `#17151D` (Deep Charcoal Ink)
- **Text Muted (`--color-muted`):** `#6D6875`
- **Lines / Borders (`--color-line`):** `#EAE7ED`

### Dark Mode (Sonic)
- **Canvas (`--color-canvas`):** `#111016` (Deep Matte Ink)
- **Surface (`--color-surface`):** `#1B1A20` (Structured Hardware Chassis)
- **Raised (`--color-raised`):** `#292830`
- **Deep (`--color-deep`):** `#141318`
- **Text Primary (`--color-fg`):** `#F4F2F7` (High-legibility Quartz)
- **Text Muted (`--color-muted`):** `#9E9AA7`
- **Lines / Borders (`--color-line`):** `#2B2A33`

---

## 2. Official Brand Gradient & Conic Buttons

The signature Audify color ramp represents the sonic frequency spectrum:
```css
/* Official Brand Gradient */
background: linear-gradient(110deg, #FF8A3D 0%, #FF4F76 35%, #F12D91 58%, #772BEE 100%);
```

Primary call-to-action buttons feature the rotating conic-gradient border:
```css
.btn-gradient-primary {
  /* High-impact electric violet with rotating conic border highlight */
  background: var(--color-primary);
  /* See src/app/globals.css for keyframe rotation */
}
```

---

## 3. Typography

- **Primary Sans:** `Geist Sans` (Clean, contemporary geometric sans-serif).
- **Technical & Timecodes:** `Geist Mono` (Tabular numbers, sample rates, dBFS metrics, duration readouts).

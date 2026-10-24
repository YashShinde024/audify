# Accessibility & Inclusivity

Audify is designed to be accessible to all users, adhering to **WCAG 2.1 Level AA** standards.

---

## 1. Keyboard Navigation & Focus Visibility

- **Keyboard Tab Order:** All interactive controls (buttons, links, sliders, tabs, inputs) are fully reachable and operable via keyboard alone.
- **Focus Indicators:** Interactive elements display a distinct focus ring (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`).
- **Waveform Seeker Keyboard Controls:** The timeline seeker slider supports `ArrowLeft` and `ArrowRight` keyboard shortcuts to scrub 5 seconds backward or forward.
- **Escape Key Handling:** Modals, dialogs, dropdowns, and the mobile navigation drawer immediately dismiss on `Escape`.

---

## 2. ARIA Semantics & Screen Readers

- **Roles & Modals:** Dialogs and mobile drawers declare `role="dialog"` with `aria-modal="true"` and corresponding `aria-labelledby`.
- **Icon-Only Buttons:** Icon buttons (e.g. Play/Pause, Rewind, Loop, Mute) declare explicit descriptive `aria-label` tags (e.g. `aria-label="Pause audio playback"`).
- **Dynamic State:** Toggles and expanded controls declare `aria-expanded` and `aria-pressed`.

---

## 3. Visual Contrast & Color Independence

- **WCAG AA/AAA Contrast:** Text colors in both light and dark modes exceed the minimum 4.5:1 contrast ratio for normal text and 3:1 for large headings.
- **Color Independence:** Status indicators never rely on color alone. States are accompanied by badges, text labels, or distinct icons.

---

## 4. Motion & Vestibular Safety

Audify respects the user's operating system motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* Wave canvas animations freeze or render as subtle static gradients */
}
```
The background canvas (`wave-field.tsx`) pauses animation cycles when `prefers-reduced-motion` is active.

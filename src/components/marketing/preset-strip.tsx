import { presets } from "@/config/presets";

/**
 * Signal Strip — a continuous marquee of preset names.
 *
 * Mechanically honest: pure CSS translateX animation over a duplicated
 * list, no JS, no layout shift. Screen readers get the names once (second
 * copy aria-hidden). prefers-reduced-motion freezes the strip; overflow
 * stays hidden so a frozen strip reads as a static ticker.
 */
export function PresetStrip() {
  const names = presets.map((p) => p.name.replace(/&#39;/g, "'"));
  const oneRun = [...names];

  return (
    <div
      aria-label="All presets"
      className="overflow-hidden border-b border-line bg-canvas py-3.5"
    >
      <div className="preset-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex items-center gap-8"
          >
            {oneRun.map((name) => (
              <li
                key={`${copy}-${name}`}
                className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-faint"
              >
                <span>{name}</span>
                <span aria-hidden="true" className="text-accent/70">
                  ✳
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

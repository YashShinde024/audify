import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { presetCategories, presets } from "@/config/presets";
import { PresetIcon } from "@/components/icons/preset-icons";
import { cn } from "@/lib/utils";

const FEATURED_IDS = [
  "slowed-reverb",
  "8d-audio",
  "pitch-432hz",
  "bass-boost-heavy",
  "nightcore",
  "lofi-tape",
  "cathedral-reverb",
  "auto-panner",
];

export function PresetSignatures({ className }: { className?: string }) {
  const featured = FEATURED_IDS.map((id) => presets.find((p) => p.id === id)).filter(
    (p): p is (typeof presets)[number] => Boolean(p),
  );

  return (
    <div className={cn("grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-16", className)}>
      {/* Left rail — editorial heading */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow text-violet">Selected Presets</p>
        <h2 className="display-title mt-3 text-3xl text-fg sm:text-4xl">
          Transformations creators come back for.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Slowed nights, calibrated sub-bass weight, 432 Hz Pythagorean transposition, cathedral reflections, cassette tape warmth, and 8D orbits.
          Each preset loads directly into the Studio with tuned starting parameters.
        </p>
        <Link
          href="/presets"
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet transition-colors hover:text-accent-hover"
        >
          View all {presets.length} presets across {presetCategories.length} categories
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      {/* Right column — editorial preset rows */}
      <ol className="divide-y divide-line border-y border-line">
        {featured.map((preset, index) => {
          const categoryLabel = presetCategories.find((c) => c.id === preset.category)?.label;
          return (
            <li key={preset.id}>
              <Link
                href={`/studio?preset=${preset.id}`}
                className="group flex items-center gap-4 sm:gap-5 py-4.5 transition-colors hover:bg-surface/50 px-2 rounded-lg"
              >
                <span className="tnum w-5 shrink-0 text-xs font-mono text-faint group-hover:text-violet" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-violet group-hover:border-violet/40 transition-colors">
                  <PresetIcon presetId={preset.id} size={18} weight="duotone" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h3 className="text-sm font-semibold text-fg group-hover:text-violet transition-colors">
                      {preset.name}
                    </h3>
                    {categoryLabel && (
                      <span className="text-[10px] uppercase tracking-wider text-muted font-medium bg-raised px-1.5 py-0.5 rounded border border-line/60">
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{preset.description}</p>
                </div>

                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  {preset.params.slice(0, 2).map((param) => (
                    <span
                      key={param.id}
                      className="rounded border border-line bg-surface px-2 py-0.5 tnum text-[11px] text-faint font-mono"
                    >
                      {param.label}: {param.kind === "slider" ? `${preset.defaults[param.id as keyof typeof preset.defaults] ?? ""}${param.unit}` : "on"}
                    </span>
                  ))}
                  <span className="text-muted group-hover:text-violet group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

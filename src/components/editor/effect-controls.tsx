"use client";

/**
 * Controls for the currently selected preset: sliders, toggles, and numeric
 * readouts. Values update UI state only until the audio engine is connected.
 */

import { SlidersHorizontal, ArrowsClockwise } from "@phosphor-icons/react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getPresetById } from "@/config/presets";
import { useEditorStore } from "@/stores/editor-store";
import type { PresetParam } from "@/types/preset";
import { cn } from "@/lib/utils";

function EffectSlider({ param }: { param: Extract<PresetParam, { kind: "slider" }> }) {
  const value = useEditorStore(
    (s) => (typeof s.effectValues[param.id] === "number" ? (s.effectValues[param.id] as number) : undefined),
  );
  const setValue = useEditorStore((s) => s.setEffectValue);

  const current = value ?? param.min ?? 0;
  const step = param.step ?? 1;

  return (
    <div className="rounded-lg border border-line bg-deep p-4">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`effect-${param.id}`} className="text-sm font-medium text-fg">
          {param.label}
        </label>
        <span className="inline-flex items-baseline gap-1 font-mono text-sm tabular-nums text-fg">
          {current}
          <span className="text-xs text-muted">{param.unit}</span>
        </span>
      </div>
      <input
        className="sr-only"
        type="number"
        id={`effect-${param.id}`}
        value={current}
        min={param.min}
        max={param.max}
        step={step}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) setValue(param.id, next);
        }}
        aria-label={`${param.label} numeric value in ${param.unit}`}
      />
      <Slider
        value={[current]}
        min={param.min}
        max={param.max}
        step={step}
        onValueChange={([next]) => setValue(param.id, next ?? current)}
        aria-label={param.label}
        className="mt-3"
      />
      <p className="mt-2 text-xs text-muted">{param.description}</p>
    </div>
  );
}

function EffectToggle({ param }: { param: Extract<PresetParam, { kind: "toggle" }> }) {
  const value = useEditorStore((s) => s.effectValues[param.id] === true);
  const setValue = useEditorStore((s) => s.setEffectValue);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-line bg-deep p-4">
      <div>
        <label htmlFor={`effect-${param.id}`} className="text-sm font-medium text-fg">
          {param.label}
        </label>
        <p className="mt-1 text-xs text-muted">{param.description}</p>
      </div>
      <Switch
        id={`effect-${param.id}`}
        checked={value}
        onCheckedChange={(checked) => setValue(param.id, checked)}
        aria-label={`${param.label} toggle`}
      />
    </div>
  );
}

export function EffectControls() {
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectedPreset = getPresetById(selectedPresetId ?? "");
  const effectValues = useEditorStore((s) => s.effectValues);
  const resetEffects = useEditorStore((s) => s.resetEffects);

  const isDirty =
    !!selectedPreset &&
    selectedPreset.params.some((param) => effectValues[param.id] !== selectedPreset.defaults[param.id]);

  if (!selectedPreset) return null;

  return (
    <section aria-labelledby="effect-controls-heading" className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={16} className="text-muted" />
          <h3 id="effect-controls-heading" className="text-base font-semibold text-fg">
            Effect controls
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span aria-live="polite" className="sr-only">
            {isDirty ? `${selectedPreset.name} effect parameters changed from defaults` : `${selectedPreset.name} at preset defaults`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={resetEffects}
            disabled={!isDirty}
            aria-label={isDirty ? "Reset effect parameters to preset defaults" : "Already at preset defaults"}
          >
            <ArrowsClockwise aria-hidden="true" size={14} />
            Reset to defaults
          </Button>
        </div>
      </div>

      <div className={cn("mt-4 grid gap-3 sm:grid-cols-2")}>
        {selectedPreset.params.map((param) => {
          if (param.kind === "slider") {
            return <EffectSlider key={param.id} param={param} />;
          }
          if (param.kind === "toggle") {
            return <EffectToggle key={param.id} param={param} />;
          }
          return null;
        })}
      </div>
    </section>
  );
}

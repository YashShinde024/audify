"use client";

/**
 * Controls for the currently selected preset.
 *
 * Every control here maps to a real branch in `resolveProcessing()` — there are
 * no decorative sliders. Values come from the store, which resets them to the
 * preset's own defaults whenever the preset changes, so settings never leak
 * between effects.
 */

import { SlidersHorizontal, ArrowsClockwise, Info } from "@phosphor-icons/react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getPresetById } from "@/config/presets";
import { useEditorStore } from "@/stores/editor-store";
import type { PresetParam } from "@/types/preset";

/** Trim sliders become bounded by the real decoded duration once a file exists. */
function useControlBounds(param: Extract<PresetParam, { kind: "slider" }>) {
  const decodedDuration = useEditorStore((s) => s.decodedAudio?.duration ?? 0);
  const isTrimParam = param.id === "trim-start" || param.id === "trim-end";
  if (!isTrimParam || decodedDuration <= 0) {
    return { min: param.min ?? 0, max: param.max ?? 100 };
  }

  const max = Math.min(param.max ?? decodedDuration, Math.max(1, Math.round(decodedDuration)));
  return { min: Math.min(param.min ?? 0, max), max };
}

function decimalsForStep(step: number): number {
  if (!Number.isFinite(step) || step >= 1) return 0;
  const text = String(step);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

function formatValue(value: number, step: number): string {
  const decimals = decimalsForStep(step);
  return decimals === 0 ? String(Math.round(value)) : value.toFixed(decimals);
}

function EffectSlider({
  param,
  defaultValue,
}: {
  param: Extract<PresetParam, { kind: "slider" }>;
  defaultValue: number;
}) {
  const storeValue = useEditorStore((s) => s.effectValues[param.id]);
  const setValue = useEditorStore((s) => s.setEffectValue);
  const bounds = useControlBounds(param);

  const raw = typeof storeValue === "number" && Number.isFinite(storeValue) ? storeValue : defaultValue;
  const step = param.step ?? 1;
  const current = Math.min(bounds.max, Math.max(bounds.min, raw));
  const inputId = `effect-${param.id}`;

  return (
    <div className="rounded-lg border border-line bg-canvas p-4">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {param.label}
        </label>
        <span className="inline-flex items-baseline gap-1 font-mono text-sm tabular-nums text-fg">
          {formatValue(current, step)}
          {param.unit && <span className="text-xs text-muted">{param.unit}</span>}
        </span>
      </div>

      <input
        className="sr-only"
        type="number"
        id={inputId}
        value={current}
        min={bounds.min}
        max={bounds.max}
        step={step}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) {
            setValue(param.id, Math.min(bounds.max, Math.max(bounds.min, next)));
          }
        }}
        aria-label={`${param.label}${param.unit ? ` in ${param.unit}` : ""}`}
      />

      <Slider
        value={[current]}
        min={bounds.min}
        max={bounds.max}
        step={step}
        onValueChange={([next]) => {
          if (typeof next === "number" && Number.isFinite(next)) setValue(param.id, next);
        }}
        aria-label={param.label}
        className="mt-3"
      />

      <p className="mt-2 text-xs leading-snug text-muted">{param.description}</p>
    </div>
  );
}

function EffectToggle({
  param,
  defaultValue,
}: {
  param: Extract<PresetParam, { kind: "toggle" }>;
  defaultValue: boolean;
}) {
  const storeValue = useEditorStore((s) => s.effectValues[param.id]);
  const setValue = useEditorStore((s) => s.setEffectValue);
  const checked = typeof storeValue === "boolean" ? storeValue : defaultValue;

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-line bg-canvas p-4">
      <div>
        <label htmlFor={`effect-${param.id}`} className="text-sm font-medium text-fg">
          {param.label}
        </label>
        <p className="mt-1 text-xs leading-snug text-muted">{param.description}</p>
      </div>
      <Switch
        id={`effect-${param.id}`}
        checked={checked}
        onCheckedChange={(next) => setValue(param.id, next)}
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
  const isProcessing = useEditorStore((s) => s.isProcessing);

  if (!selectedPreset) return null;

  const isDirty = selectedPreset.params.some((param) => {
    const expected = selectedPreset.defaults[param.id];
    if (typeof expected === "undefined") return false;
    // The trimmer's end default is the file duration, which the store manages.
    if (selectedPreset.id === "trimmer-cutter") return false;
    return effectValues[param.id] !== expected;
  });

  return (
    <section
      aria-labelledby="effect-controls-heading"
      className="rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={16} className="text-muted" />
          <h3 id="effect-controls-heading" className="text-base font-semibold text-fg">
            Effect controls
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span aria-live="polite" className="sr-only">
            {isDirty
              ? `${selectedPreset.name} parameters changed from defaults`
              : `${selectedPreset.name} at preset defaults`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={resetEffects}
            disabled={!isDirty}
            aria-label={
              isDirty ? "Reset effect parameters to preset defaults" : "Already at preset defaults"
            }
          >
            <ArrowsClockwise aria-hidden="true" size={14} />
            Reset to defaults
          </Button>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs leading-snug text-muted">
        <Info aria-hidden="true" size={13} className="mt-0.5 shrink-0 text-faint" />
        These controls are specific to{" "}
        <span className="font-medium text-fg">{selectedPreset.name}</span>. Switching presets
        loads that preset&apos;s own defaults.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {selectedPreset.params.map((param) => {
          if (param.kind === "slider") {
            return (
              <EffectSlider
                key={param.id}
                param={param}
                defaultValue={
                  typeof selectedPreset.defaults[param.id] === "number"
                    ? (selectedPreset.defaults[param.id] as number)
                    : (param.min ?? 0)
                }
              />
            );
          }
          if (param.kind === "toggle") {
            return (
              <EffectToggle
                key={param.id}
                param={param}
                defaultValue={selectedPreset.defaults[param.id] === true}
              />
            );
          }
          return null;
        })}
      </div>

      {isProcessing && (
        <p className="mt-4 rounded-md border border-line bg-canvas px-3 py-2 text-xs text-muted">
          A render is running. Edits made now will mark the finished file as out of date so you can
          reprocess it.
        </p>
      )}
    </section>
  );
}

"use client";

import React from "react";
import type { ToolDefinition, ToolSetting } from "@/config/tools-registry";
import { ArrowCounterClockwise, Info } from "@phosphor-icons/react";

interface ToolSettingsProps {
  tool: ToolDefinition;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  onReset: () => void;
  audioDuration?: number;
  disabled?: boolean;
}

export function ToolSettings({
  tool,
  values,
  onChange,
  onReset,
  audioDuration = 60,
  disabled = false,
}: ToolSettingsProps) {
  if (!tool.settings || tool.settings.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-line bg-surface/60 text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-fg">Automatic Analysis Tool</p>
        <p className="text-xs text-muted max-w-sm mx-auto">
          This utility analyzes your audio file automatically using client-side header and sample diagnostics. No extra configuration needed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 rounded-2xl border border-line bg-surface/60 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div>
          <h3 className="text-base font-semibold text-fg">Tool Configuration</h3>
          <p className="text-xs text-muted">Customize processing parameters for {tool.name}</p>
        </div>
        <button
          onClick={onReset}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg hover:bg-raised px-2.5 py-1.5 rounded-lg border border-line transition-colors disabled:opacity-40"
          title="Reset to recommended defaults"
        >
          <ArrowCounterClockwise className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-5">
        {tool.settings.map((setting) => {
          const val = values[setting.id] !== undefined ? values[setting.id] : setting.defaultValue;

          // -------------------------------------------------------------
          // SELECT DROPDOWN
          // -------------------------------------------------------------
          if (setting.type === "select") {
            return (
              <div key={setting.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-sm font-medium text-fg">
                    {setting.label}
                  </label>
                </div>
                <select
                  id={setting.id}
                  value={val}
                  disabled={disabled}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = Number(raw);
                    onChange(setting.id, !isNaN(num) && setting.options?.some((o) => typeof o.value === "number") ? num : raw);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-raised text-sm text-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
                >
                  {setting.options?.map((opt) => (
                    <option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {setting.description && (
                  <p className="text-xs text-muted">{setting.description}</p>
                )}
              </div>
            );
          }

          // -------------------------------------------------------------
          // SLIDER
          // -------------------------------------------------------------
          if (setting.type === "slider") {
            const min = setting.min ?? 0;
            const max = setting.max ?? 100;
            const step = setting.step ?? 1;

            return (
              <div key={setting.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-sm font-medium text-fg">
                    {setting.label}
                  </label>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                    {val}
                    {setting.unit ? ` ${setting.unit}` : ""}
                  </span>
                </div>
                <input
                  id={setting.id}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  disabled={disabled}
                  onChange={(e) => onChange(setting.id, Number(e.target.value))}
                  className="w-full h-2 bg-raised border border-line rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                />
                <div className="flex justify-between text-[11px] text-muted font-mono">
                  <span>
                    {min}
                    {setting.unit ? ` ${setting.unit}` : ""}
                  </span>
                  <span>
                    {max}
                    {setting.unit ? ` ${setting.unit}` : ""}
                  </span>
                </div>
                {setting.description && (
                  <p className="text-xs text-muted">{setting.description}</p>
                )}
              </div>
            );
          }

          // -------------------------------------------------------------
          // TOGGLE SWITCH
          // -------------------------------------------------------------
          if (setting.type === "toggle") {
            const isChecked = Boolean(val);
            return (
              <div
                key={setting.id}
                className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-line bg-raised/40"
              >
                <div className="space-y-0.5">
                  <label htmlFor={setting.id} className="text-sm font-medium text-fg cursor-pointer">
                    {setting.label}
                  </label>
                  {setting.description && (
                    <p className="text-xs text-muted">{setting.description}</p>
                  )}
                </div>
                <button
                  id={setting.id}
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  disabled={disabled}
                  onClick={() => onChange(setting.id, !isChecked)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-line transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50
                    ${isChecked ? "bg-primary border-primary" : "bg-raised"}
                  `}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                      ${isChecked ? "translate-x-5" : "translate-x-0"}
                    `}
                  />
                </button>
              </div>
            );
          }

          // -------------------------------------------------------------
          // TIME-RANGE (TRIMMER)
          // -------------------------------------------------------------
          if (setting.type === "time-range") {
            const currentRange = typeof val === "object" && val !== null ? val : { start: 0, end: Math.min(30, audioDuration) };
            const startVal = Number(currentRange.start ?? 0);
            const endVal = Number(currentRange.end ?? audioDuration);

            return (
              <div key={setting.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-fg">{setting.label}</label>
                  <span className="text-xs font-mono font-medium text-primary">
                    Selected: {(endVal - startVal).toFixed(1)}s
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted">Start Time (sec)</span>
                    <input
                      type="number"
                      min={0}
                      max={Math.max(0, endVal - 0.1)}
                      step={0.1}
                      value={startVal}
                      disabled={disabled}
                      onChange={(e) => {
                        const newStart = Math.max(0, Math.min(Number(e.target.value), endVal - 0.1));
                        onChange(setting.id, { start: newStart, end: endVal });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-line bg-raised text-sm font-mono text-fg focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted">End Time (sec)</span>
                    <input
                      type="number"
                      min={startVal + 0.1}
                      max={audioDuration}
                      step={0.1}
                      value={endVal}
                      disabled={disabled}
                      onChange={(e) => {
                        const newEnd = Math.max(startVal + 0.1, Math.min(Number(e.target.value), audioDuration));
                        onChange(setting.id, { start: startVal, end: newEnd });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-line bg-raised text-sm font-mono text-fg focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {setting.description && (
                  <p className="text-xs text-muted">{setting.description}</p>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

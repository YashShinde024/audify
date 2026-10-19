"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";
import { presets } from "@/config/presets";

export function StudioInitializer() {
  const searchParams = useSearchParams();
  const selectPreset = useEditorStore((s) => s.selectPreset);

  useEffect(() => {
    const presetParam = searchParams.get("preset");
    if (presetParam && presets.some((p) => p.id === presetParam)) {
      selectPreset(presetParam);
    }
  }, [searchParams, selectPreset]);

  return null;
}

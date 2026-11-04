"use client";

import { useState, useEffect, useCallback } from "react";
import {
  isCompletionSoundEnabled,
  setCompletionSoundEnabled,
  previewCompletionSound,
  COMPLETION_SOUND_EVENT,
} from "@/lib/audio/completion-sound";

export function useCompletionSoundPreference() {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    // Read initial preference on mount
    setEnabledState(isCompletionSoundEnabled());

    const handlePreferenceChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (typeof customEvent.detail?.enabled === "boolean") {
        setEnabledState(customEvent.detail.enabled);
      } else {
        setEnabledState(isCompletionSoundEnabled());
      }
    };

    window.addEventListener(COMPLETION_SOUND_EVENT, handlePreferenceChange);
    return () => {
      window.removeEventListener(COMPLETION_SOUND_EVENT, handlePreferenceChange);
    };
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    setCompletionSoundEnabled(value);
  }, []);

  const preview = useCallback(async () => {
    return previewCompletionSound();
  }, []);

  return {
    enabled,
    setEnabled,
    preview,
  };
}


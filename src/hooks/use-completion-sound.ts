"use client";

import { useSyncExternalStore, useCallback } from "react";
import {
  isCompletionSoundEnabled,
  setCompletionSoundEnabled,
  previewCompletionSound,
  COMPLETION_SOUND_EVENT,
} from "@/lib/audio/completion-sound";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COMPLETION_SOUND_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(COMPLETION_SOUND_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): boolean {
  return isCompletionSoundEnabled();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useCompletionSoundPreference() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setEnabled = useCallback((value: boolean) => {
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

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";

interface SidebarContextValue {
  isOpen: boolean;
  isDocked: boolean;
  width: number;
  setWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  toggleOpen: () => void;
  toggleDock: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

const DOCKED_STORAGE_KEY = "audiomorph-sidebar-docked";
const WIDTH_STORAGE_KEY = "audiomorph-sidebar-width";
export const DEFAULT_SIDEBAR_WIDTH = 288;
export const MIN_SIDEBAR_WIDTH = 220;
export const MAX_SIDEBAR_WIDTH = 440;

let dockedListeners: Array<() => void> = [];

function emitDockedChange() {
  for (const listener of dockedListeners) {
    listener();
  }
}

function subscribeDocked(callback: () => void) {
  dockedListeners.push(callback);
  return () => {
    dockedListeners = dockedListeners.filter((l) => l !== callback);
  };
}

function getDockedSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(DOCKED_STORAGE_KEY);
    if (val !== null) return val === "true";
    return window.innerWidth >= 1280;
  } catch {
    return true;
  }
}

function getDockedServerSnapshot(): boolean {
  return true;
}

let widthListeners: Array<() => void> = [];

function emitWidthChange() {
  for (const listener of widthListeners) {
    listener();
  }
}

function subscribeWidth(callback: () => void) {
  widthListeners.push(callback);
  return () => {
    widthListeners = widthListeners.filter((l) => l !== callback);
  };
}

let cachedWidth = DEFAULT_SIDEBAR_WIDTH;

function getWidthSnapshot(): number {
  if (typeof window === "undefined") return DEFAULT_SIDEBAR_WIDTH;
  try {
    const val = localStorage.getItem(WIDTH_STORAGE_KEY);
    if (val) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
        cachedWidth = parsed;
        return cachedWidth;
      }
    }
  } catch {
    // ignore
  }
  return cachedWidth;
}

function getWidthServerSnapshot(): number {
  return DEFAULT_SIDEBAR_WIDTH;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const isDocked = useSyncExternalStore(
    subscribeDocked,
    getDockedSnapshot,
    getDockedServerSnapshot
  );

  const width = useSyncExternalStore(
    subscribeWidth,
    getWidthSnapshot,
    getWidthServerSnapshot
  );

  const setWidth = useCallback((newWidth: number) => {
    const clamped = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth));
    cachedWidth = clamped;
    try {
      localStorage.setItem(WIDTH_STORAGE_KEY, String(clamped));
    } catch {
      // ignore
    }
    emitWidthChange();
  }, []);

  const toggleDock = useCallback(() => {
    try {
      const current = getDockedSnapshot();
      localStorage.setItem(DOCKED_STORAGE_KEY, String(!current));
      emitDockedChange();
    } catch {
      // ignore
    }
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard shortcut: ⌘K or Ctrl+K toggles the sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
          toggleDock();
        } else {
          toggleOpen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDock, toggleOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isDocked,
        width,
        setWidth,
        isResizing,
        setIsResizing,
        toggleOpen,
        toggleDock,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}

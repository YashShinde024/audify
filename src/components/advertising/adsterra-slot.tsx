"use client";

import { useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import type { AdsterraSlotConfig } from "@/config/ads";

interface AdsterraSlotProps {
  /** Slot configuration from config/ads.ts */
  config: AdsterraSlotConfig;
  /** Additional CSS class names for the outer container */
  className?: string;
}

/**
 * Serializes Adsterra slot initialization across the whole page.
 *
 * Adsterra's iframe integration reads the mutable global `window.atOptions`
 * when its loader script executes. Because dynamically-inserted scripts are
 * asynchronous by default, two loaders can interleave: loader A may execute
 * *after* slot B has already overwritten `atOptions`, causing A to serve B's
 * ad. `useId()` does NOT isolate JavaScript globals; it only prevents DOM id
 * collisions. Instead we run each (atOptions → loader) pair as one serialized
 * job: the next job starts only after the previous loader script's `onload`
 * event, guaranteeing the loader reads its own configuration.
 */
let inFlight: Promise<void> = Promise.resolve();

function scheduleSlotJob(job: () => Promise<void>): Promise<void> {
  inFlight = inFlight.then(job).catch(() => {
    /* a failed slot must not block subsequent slots */
  });
  return inFlight;
}

/**
 * Renders a single Adsterra iframe ad slot.
 *
 * Correctness rules enforced here:
 *   1. The (atOptions + loader) pair is injected atomically and serialized with
 *      every other slot on the page, so no loader can read a foreign config.
 *   2. Strict-Mount double-mounting cannot re-execute scripts: once injected,
 *      the slot is permanently inert for the lifetime of the container element
 *      (Strict Mode double-invoke runs on the SAME DOM node; the second effect
 *      run sees a populated container and returns early — the first ad stays
 *      intact instead of being torn down and re-served).
 *   3. Cleanup never clears or resets the mounted flag; on route transitions
 *      the component unmounts with the page and the ad dies with it.
 */
export function AdsterraSlot({ config, className }: AdsterraSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  // Trigger a render after the first effect run so the container can hold the
  // sticky height we reserve (prevents layout shift while the iframe loads).
  const [, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Step 1: strict-mount / re-render guard — never inject twice for the
    // same container element.
    if (initializedRef.current) {
      setReady(true);
      return;
    }
    initializedRef.current = true;

    scheduleSlotJob(async () => {
      // The component may have unmounted while the queue drained.
      if (!container.isConnected || container.childElementCount > 0) return;

      const optionsScript = document.createElement("script");
      optionsScript.type = "text/javascript";
      optionsScript.textContent = `atOptions = ${JSON.stringify({
        key: config.key,
        format: config.format,
        height: config.height,
        width: config.width,
        params: {},
      })};`;

      const loaderScript = document.createElement("script");
      loaderScript.type = "text/javascript";
      loaderScript.src = config.scriptSrc;
      // IMPORTANT: async=false puts the script in the in-order queue, so after
      // this point no other slot's pair can interleave until onload resolves.
      loaderScript.async = false;

      container.appendChild(optionsScript);
      container.appendChild(loaderScript);

      await new Promise<void>((resolve) => {
        loaderScript.onload = () => resolve();
        loaderScript.onerror = () => resolve();
        // Hard cap in case the vendor script never fires onload.
        window.setTimeout(resolve, 8000);
      });
    }).then(() => setReady(true));
  }, [config.key, config.format, config.height, config.width, config.scriptSrc]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: config.width,
        maxWidth: "100%",
        height: config.height,
        overflow: "hidden",
      }}
      data-ad-key={config.key}
    />
  );
}

function makeMediaSubscriber(query: string) {
  return (onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

/**
 * Renders only when the given breakpoint rule currently matches.
 *
 * We gate on the media query in JS (not just CSS `display`) because Adsterra
 * scripts inside a `display: none` container still load and consume an
 * impression — hidden slots would double-serve the responsive banner pair.
 * SSR renders `false` (via getServerSnapshot); the child never loads
 * third-party scripts during hydration or on mismatched viewports.
 */
export function useMediaMatch(query: string): boolean {
  const subscribe = useMemo(() => makeMediaSubscriber(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Media queries mirrored by AdBanner for its two supplied banner formats. */
export const DESKTOP_AD_QUERY = "(min-width: 768px)";

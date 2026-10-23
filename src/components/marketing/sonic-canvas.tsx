"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";

interface SonicCanvasProps {
  className?: string;
  analyser?: AnalyserNode | null;
}

/**
 * Editorial Sonic Canvas.
 *
 * Restrained, high-efficiency wave field designed for a calm audio workstation:
 * - Fine monochrome wave lines in neutral graphite with a single subtle violet accent (#8E7CC3).
 * - Single coordinated animation loop (~30-60 FPS, bounded DPR of 1.5).
 * - Automatically pauses when tab is hidden or when scrolled out of view via IntersectionObserver.
 * - Container-based sizing using ResizeObserver.
 * - Purely genuine audio reactivity: only modulates amplitude when connected to a real Web Audio AnalyserNode.
 *   Never simulates fake sine pulses.
 * - Dynamic reduced motion detection with live change listener and static fallback.
 * - Does not restart the animation when playback state toggles (uses mutable refs).
 * - Fully decorative (aria-hidden="true", pointer-events-none).
 */
export function SonicCanvas({ className, analyser }: SonicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lazy initialization to prevent synchronous setState during effect mount
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const isPlaying = useEditorStore((s) => s.isPlaying);

  // Keep references to isPlaying and analyser so playback changes do not tear down the canvas
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const analyserRef = useRef(analyser);
  useEffect(() => {
    analyserRef.current = analyser;
  }, [analyser]);

  // Listen for prefers-reduced-motion changes while the page is open
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isIntersecting = true;
    let isVisible = !document.hidden;
    let width = 0;
    let height = 0;
    let time = 0;

    // Smoothed pointer coordinates (relative to container)
    const pointer = {
      targetX: 0.5,
      targetY: 0.5,
      currentX: 0.5,
      currentY: 0.5,
    };

    let freqBuffer: Uint8Array<ArrayBuffer> | null = null;

    const updateDimensions = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(280, Math.floor(rect.width));
      height = Math.max(160, Math.floor(rect.height));

      // Cap DPR to 1.5 to bound rendering cost on mobile and 4K displays
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting;
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Passive pointer movement attached to container instead of global window
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointer.targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        pointer.targetY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
    };
    container.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && isIntersecting) {
        lastTime = performance.now();
        render(performance.now());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisible || !isIntersecting) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      // Subtle pointer smoothing
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.04;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.04;

      // Extract genuine audio energy ONLY when real AnalyserNode is connected and audio is playing
      let audioPulse = 0;
      const currentAnalyser = analyserRef.current;
      const currentPlaying = isPlayingRef.current;

      if (currentAnalyser && currentPlaying) {
        if (!freqBuffer || freqBuffer.length !== currentAnalyser.frequencyBinCount) {
          freqBuffer = new Uint8Array(new ArrayBuffer(currentAnalyser.frequencyBinCount));
        }
        currentAnalyser.getByteFrequencyData(freqBuffer);
        const sampleBins = Math.min(24, freqBuffer.length);
        let sum = 0;
        for (let i = 0; i < sampleBins; i++) {
          sum += freqBuffer[i];
        }
        audioPulse = sum / (sampleBins * 255);
      }

      time += delta * 0.75;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");

      // Fine Audify brand waves: violet (#772bee), crimson/pink (#f12d91), and neutral graphite
      const waveProfiles = [
        {
          amplitude: 16 + audioPulse * 26,
          frequency: 0.0022,
          speed: 0.7,
          offset: 0,
          color: isDark ? "rgba(138, 63, 252, 0.65)" : "rgba(121, 40, 202, 0.48)", // Powerful Audify violet
          lineWidth: 1.6,
          yFactor: 0.48,
        },
        {
          amplitude: 18 + audioPulse * 24,
          frequency: 0.0018,
          speed: 0.85,
          offset: Math.PI / 2.5,
          color: isDark ? "rgba(241, 45, 145, 0.38)" : "rgba(241, 45, 145, 0.28)", // Audify crimson/pink
          lineWidth: 1.1,
          yFactor: 0.54,
        },
        {
          amplitude: 10 + audioPulse * 16,
          frequency: 0.003,
          speed: 0.5,
          offset: Math.PI / 1.4,
          color: isDark ? "rgba(244, 242, 247, 0.14)" : "rgba(23, 21, 29, 0.09)", // Fine neutral
          lineWidth: 0.9,
          yFactor: 0.62,
        },
      ];

      const pointerOffsetY = (pointer.currentY - 0.5) * 24;
      const pointerPhase = (pointer.currentX - 0.5) * 1.5;

      for (let w = 0; w < waveProfiles.length; w++) {
        const wave = waveProfiles[w];
        ctx.beginPath();
        const baseHeight = height * wave.yFactor + pointerOffsetY * (w * 0.4 + 0.6);

        for (let x = 0; x <= width; x += 16) {
          const y =
            baseHeight +
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset + pointerPhase) * wave.amplitude +
            Math.cos(x * 0.0008 - time * 0.25) * (wave.amplitude * 0.3);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden select-none", className)}
    >
      {/* Interactive WaveField Canvas */}
      {!reducedMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-70 dark:opacity-80"
          style={{ willChange: "transform" }}
        />
      ) : (
        /* Reduced motion static hairline fallback */
        <svg
          className="absolute inset-0 h-full w-full opacity-35 dark:opacity-25"
          viewBox="0 0 1440 720"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M-80 380 Q 360 320 720 370 T 1560 330"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-primary/40"
          />
          <path
            d="M-80 440 Q 420 390 780 430 T 1580 400"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted/30"
          />
        </svg>
      )}
    </div>
  );
}

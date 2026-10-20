"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * WaveField — animated background waves.
 *
 * A canvas that draws three layered traveling sine waves drifting slowly
 * across the lower portion of a section. Honest mechanics:
 *
 * - rAF loop ties motion strictly to animation frames of visible time
 *   (document.hidden pauses it);
 * - prefers-reduced-motion draws a single static frame and never animates;
 * - device-pixel-ratio aware so strokes stay crisp on HiDPI;
 * - colors are read from the live CSS tokens at paint time, so both themes
 *   are covered;
 * - decorative only: aria-hidden, no semantics, no pointer events.
 *
 * Companion to the Living Sonic Canvas mesh: the mesh drifts diagonally,
 * this field travels horizontally — layered depth without competing motion.
 */
export function WaveField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const readColors = () => {
      const styles = getComputedStyle(canvas);
      const raw = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;
      return {
        waveA: raw("--color-accent", "rgba(120,120,140,0.5)"),
        waveB: raw("--color-violet", "rgba(120,120,140,0.4)"),
        waveC: raw("--color-faint", "rgba(120,120,140,0.3)"),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      width = rect.width;
      height = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());
    };

    /** One sine layer as an open fill-down region. */
    const drawWave = (
      t: number,
      amp: number,
      wavelength: number,
      speed: number,
      yBase: number,
      color: string,
      alpha: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(-10, height + 10);
      for (let x = -10; x <= width + 10; x += 4) {
        const phase = (x / wavelength) * Math.PI * 2 + t * speed;
        const y = yBase + Math.sin(phase) * amp + Math.sin(phase * 0.41) * amp * 0.18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + 10, height + 10);
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const paint = (t: number) => {
      const { waveA, waveB, waveC } = readColors();
      // Seconds since page load, not wall clock → stable under pause.
      const s = t / 1000;
      ctx.clearRect(0, 0, width, height);
      drawWave(s, 14, 340, 0.10, height * 0.52, waveC, 0.10);
      drawWave(s, 18, 520, 0.07, height * 0.66, waveB, 0.12);
      drawWave(s, 10, 260, 0.13, height * 0.78, waveA, 0.10);
    };

    const loop = (t: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(loop);
        return;
      }
      paint(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      paint(performance.now()); // static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-full w-full",
        className,
      )}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";

interface SonicCanvasProps {
  className?: string;
  analyser?: AnalyserNode | null;
}

/**
 * Living Sonic Canvas & WaveField.
 *
 * Requirements satisfied:
 * - Subtle, elegant movement with restrained crimson ambient lighting.
 * - Optional pointer response on supported devices.
 * - Audio-reactive visuals when connected to audio playback or analyser data.
 * - Strict reduced-motion support and static fallback.
 * - Clean cleanup, visibility handling (pauses when tab hidden).
 * - Responsive canvas sizing capped at 2x DPR to preserve CPU & battery.
 * - Purely decorative (aria-hidden, pointer-events-none).
 */
export function SonicCanvas({ className, analyser }: SonicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isPlaying = useEditorStore((s) => s.isPlaying);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

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
    let isVisible = !document.hidden;
    let width = 0;
    let height = 0;
    let time = 0;

    // Pointer response state
    const pointer = {
      targetX: 0.5,
      targetY: 0.5,
      currentX: 0.5,
      currentY: 0.5,
    };

    // Analyser buffer for real-time reactivity
    let freqData: Uint8Array<ArrayBuffer> | null = null;
    if (analyser) {
      freqData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    }

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(300, rect.width);
      height = Math.max(200, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointer.targetX = (e.clientX - rect.left) / rect.width;
        pointer.targetY = (e.clientY - rect.top) / rect.height;
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        render(performance.now());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth pointer interpolation
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.05;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.05;

      // Extract real audio frequency energy if analyser is connected
      let audioPulse = 0;
      if (analyser && freqData && isPlaying) {
        analyser.getByteFrequencyData(freqData);
        // Average low-mid bins (bass/energy)
        let sum = 0;
        const count = Math.min(16, freqData.length);
        for (let i = 0; i < count; i++) {
          sum += freqData[i];
        }
        audioPulse = sum / (count * 255); // 0..1
      } else if (isPlaying) {
        // Fallback rhythmic pulse when playing in Studio without direct analyser node
        audioPulse = 0.2 + 0.15 * Math.sin(now * 0.005);
      }

      const speedMultiplier = isPlaying ? 1.4 : 0.8;
      time += delta * speedMultiplier;

      ctx.clearRect(0, 0, width, height);

      // Render 3 subtle flowing harmonic curves with the Audify Sonic triad (Violet, Pink, Orange)
      const isDark = document.documentElement.classList.contains("dark");
      const baseAlpha = isDark ? 0.28 : 0.18;
      const sonicTriad = ["119, 43, 238", "241, 45, 145", "255, 107, 69"];

      const waves = [
        { amplitude: 22 + audioPulse * 28, frequency: 0.003, speed: 0.8, offset: 0, alpha: baseAlpha * 1.2, color: sonicTriad[0] },
        { amplitude: 35 + audioPulse * 40, frequency: 0.002, speed: 1.1, offset: Math.PI / 3, alpha: baseAlpha * 0.95, color: sonicTriad[1] },
        { amplitude: 16 + audioPulse * 20, frequency: 0.004, speed: 0.6, offset: Math.PI / 1.5, alpha: baseAlpha * 0.8, color: sonicTriad[2] },
      ];

      const pointerOffsetY = (pointer.currentY - 0.5) * 40;
      const pointerPhase = (pointer.currentX - 0.5) * Math.PI;

      waves.forEach((wave, idx) => {
        ctx.beginPath();
        const baseHeight = height * (0.42 + idx * 0.09) + pointerOffsetY * (idx + 1) * 0.3;

        for (let x = 0; x <= width; x += 12) {
          const y =
            baseHeight +
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset + pointerPhase) * wave.amplitude +
            Math.cos(x * 0.001 - time * 0.3) * (wave.amplitude * 0.35);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = `rgba(${wave.color}, ${wave.alpha})`;
        ctx.lineWidth = 1.35;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reducedMotion, analyser, isPlaying]);

  return (
    <div
      aria-hidden="true"
      ref={containerRef}
      className={cn("sonic-canvas pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Ambient restrained red/crimson lighting source */}
      <div className="sonic-canvas__glow" />

      {/* Interactive WaveField Canvas */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-80"
          style={{ willChange: "transform" }}
        />
      )}

      {/* Static Constellation & Harmonic Curves SVG Fallback / Base Layer */}
      <svg
        className="sonic-canvas__mesh"
        viewBox="0 0 1440 720"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="1">
          <path d="M-80 560 Q 360 380 720 470 T 1560 360" opacity="0.3" />
          <path d="M-80 610 Q 420 440 780 530 T 1580 430" opacity="0.2" />
          <path d="M-40 180 Q 340 90 720 160 T 1520 90" opacity="0.25" />
          <path d="M980 120 Q 1120 150 1180 300" opacity="0.35" />
          <path d="M980 120 Q 1160 200 1260 380" opacity="0.22" />
          <path d="M980 120 Q 1200 260 1330 470" opacity="0.15" />
          <path d="M180 620 Q 330 560 400 430" opacity="0.25" />
        </g>

        {/* Constellation nodes & connector hairlines */}
        <g stroke="currentColor" strokeWidth="0.75" opacity="0.45">
          <path d="M300 220 L 372 260 L 340 330 L 420 392 M 372 260 L 470 232" />
          <path d="M1040 480 L 1112 520 L 1150 600 M 1112 520 L 1200 500" />
          <path d="M720 240 L 790 290 L 760 360" />
        </g>
        <g fill="currentColor">
          <circle cx="300" cy="220" r="2" opacity="0.55" />
          <circle cx="372" cy="260" r="2" opacity="0.4" />
          <circle cx="340" cy="330" r="2" opacity="0.35" />
          <circle cx="420" cy="392" r="2" opacity="0.5" />
          <circle cx="470" cy="232" r="1.5" opacity="0.4" />
          <circle cx="1040" cy="480" r="2" opacity="0.5" />
          <circle cx="1112" cy="520" r="2" opacity="0.35" />
          <circle cx="1150" cy="600" r="2" opacity="0.45" />
          <circle cx="1200" cy="500" r="1.5" opacity="0.4" />
          <circle cx="720" cy="240" r="2" opacity="0.45" />
          <circle cx="790" cy="290" r="2" opacity="0.35" />
          <circle cx="760" cy="360" r="2" opacity="0.3" />
          <circle cx="980" cy="120" r="3.5" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

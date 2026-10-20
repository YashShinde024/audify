import { cn } from "@/lib/utils";

/**
 * Living Sonic Canvas.
 *
 * A decorative background mesh of fine curves, constellation points and
 * connected paths suggesting sound moving through space. Purely presentational:
 *
 * - aria-hidden and focus-invisible (no semantics, no interaction);
 * - driven entirely by CSS keyframes on filtered transforms — no JS, no
 *   rAF loop, nothing runs when the tab is hidden;
 * - `prefers-reduced-motion` disables the drift at the CSS layer;
 * - absolutely positioned inside the parent with overflow clipping, so it
 *   can never affect layout.
 *
 * The crimson "light source" is a blurred radial wash; mesh strokes are
 * drawn from token-driven currentColor so both themes stay coherent.
 */

export function SonicCanvas({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("sonic-canvas absolute inset-0 overflow-hidden", className)}
    >
      {/* Ambient crimson light source */}
      <div className="sonic-canvas__glow" />

      {/* Mesh layer: fine arcs + constellation */}
      <svg
        className="sonic-canvas__mesh"
        viewBox="0 0 1440 720"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="currentColor" strokeWidth="1">
          {/* Fine field curves */}
          <path d="M-80 560 Q 360 380 720 470 T 1560 360" opacity="0.35" />
          <path d="M-80 610 Q 420 440 780 530 T 1580 430" opacity="0.25" />
          <path d="M-40 180 Q 340 90 720 160 T 1520 90" opacity="0.3" />
          {/* Quarter-arc families emanating from a common node */}
          <path d="M980 120 Q 1120 150 1180 300" opacity="0.4" />
          <path d="M980 120 Q 1160 200 1260 380" opacity="0.28" />
          <path d="M980 120 Q 1200 260 1330 470" opacity="0.18" />
          <path d="M180 620 Q 330 560 400 430" opacity="0.3" />
          <path d="M180 620 Q 360 520 470 360" opacity="0.2" />
        </g>

        {/* Constellation: points joined by hairlines */}
        <g stroke="currentColor" strokeWidth="0.75" opacity="0.5">
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
          {/* The source node the arcs emanate from */}
          <circle cx="980" cy="120" r="3.5" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

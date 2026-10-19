import { cn } from "@/lib/utils";

/**
 * Svaraya brand mark: an audio waveform inside a deep-indigo tile with a
 * violet→blue gradient stroke. Purely decorative; the wordmark sits next to it.
 */
export function Logo({ className }: { className?: string }) {
  const barTops = [
    { x: 3.4, top: 6.4, bottom: 9.6 },
    { x: 8.2, top: 4.4, bottom: 11.6 },
    { x: 15.8, top: 3.2, bottom: 12.8 },
    { x: 20.6, top: 5.4, bottom: 10.6 },
  ];
  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line-strong bg-raised",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 16" fill="none" className="h-4 w-6">
        <defs>
          <linearGradient id="svaraya-mark" x1="2" y1="8" x2="22" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        {barTops.map((bar) => (
          <line
            key={bar.x}
            x1={bar.x}
            y1={bar.top}
            x2={bar.x}
            y2={bar.bottom}
            stroke="url(#svaraya-mark)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </span>
  );
}

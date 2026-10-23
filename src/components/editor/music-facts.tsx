"use client";

import { useState, useEffect } from "react";
import { Sparkle, Info, Lightbulb } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const MUSIC_EDIT_FACTS = [
  {
    topic: "Slowed + Reverb",
    fact: "Slowed + Reverb originated in Houston from DJ Screw's 1990s chopped-and-screwed turntable slowing techniques.",
  },
  {
    topic: "Acoustic Tuning",
    fact: "Giuseppe Verdi petitioned for A=432 Hz in 1884 to protect the natural warm resonance of classical opera vocalists.",
  },
  {
    topic: "Psychoacoustics",
    fact: "8D Audio relies on Interaural Time Difference (ITD)—your brain computes microsecond phase offsets between ears to simulate 3D space.",
  },
  {
    topic: "Decibel Math",
    fact: "Decibels are logarithmic: a +6 dB increase doubles acoustic signal amplitude, while +10 dB feels twice as loud to human hearing.",
  },
  {
    topic: "Tape Saturation",
    fact: "Analog tape compression is caused by magnetic hysteresis when ferric oxide particles reach saturation limit, adding musical harmonics.",
  },
  {
    topic: "Nightcore History",
    fact: "Nightcore was founded in 2002 by Norwegian producers Thomas Nilsen and Steffen Søderholm by accelerating eurodance tracks by 25%.",
  },
  {
    topic: "True Peak Headroom",
    fact: "Intersample peaks can clip speakers even if samples read under 0 dBFS. Audify's look-ahead limiter maintains a strict −0.3 dBFS ceiling.",
  },
  {
    topic: "Private In-Browser DSP",
    fact: "Audify processes all audio directly on your CPU via multi-threaded Web Audio buffers—zero bytes are ever sent to an external server.",
  },
];

export function MusicEditFacts({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MUSIC_EDIT_FACTS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const current = MUSIC_EDIT_FACTS[index];

  return (
    <div
      className={cn(
        "relative rounded-xl border border-line bg-surface/80 p-3 sm:p-4 backdrop-blur-md overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Lightbulb size={12} weight="fill" />
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
          Music Production & Acoustic Fact
        </span>
        <span className="ml-auto text-[9px] font-mono text-faint">
          {index + 1} / {MUSIC_EDIT_FACTS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="space-y-0.5"
        >
          <p className="text-xs font-semibold text-fg">{current.topic}</p>
          <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
            {current.fact}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MusicNotes, Code } from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

const ATTRIBUTIONS = [
  {
    prefix: "Developed by",
    name: "Nyxen with",
    icon: Heart,
    iconColor: "text-red-500",
    url: "https://nyxen.in",
  },
  {
    prefix: "Music Partner:",
    name: "Xpert Melody",
    icon: MusicNotes,
    iconColor: "text-primary",
    url: siteConfig.youtubeUrl,
  },
  {
    prefix: "Crafted by",
    name: "Yash Shinde",
    icon: Code,
    iconColor: "text-violet",
    url: "https://yashshinde.in",
  },
];

export function FooterAttribution() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ATTRIBUTIONS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const current = ATTRIBUTIONS[index];
  const Icon = current.icon;

  return (
    <div className="relative inline-flex items-center min-h-[34px]">
      <div className="rounded-full border border-line bg-surface/90 px-3 py-1 shadow-xs hover:border-primary/40 transition-colors">
        <AnimatePresence mode="wait">
          <motion.a
            key={index}
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg font-medium group"
          >
            <span>{current.prefix}</span>
            <span className="font-semibold text-primary group-hover:underline underline-offset-2">
              {current.name}
            </span>
            <Icon size={12} weight="fill" className={current.iconColor} />
          </motion.a>
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { contactFormLimiter } from "@/lib/rate-limiter";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("preset-request");
  const [message, setMessage] = useState("");
  const [audioFormat, setAudioFormat] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Rate-limiting check to prevent dispatch spamming
    const rateCheck = contactFormLimiter.check();
    if (!rateCheck.allowed) {
      toast.error(rateCheck.reason || "Dispatch rate limit reached. Please wait a moment.");
      return;
    }

    setSubmitting(true);
    // Simulate instantaneous local processing / transmission
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Message dispatched successfully! The team will follow up within 24–48 hours.");
  };

  if (submitted) {
    return (
      <div className="surface-card rounded-2xl p-8 sm:p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent border border-accent/20">
          <CheckCircle size={32} weight="duotone" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-fg tracking-tight">
          Dispatch Received
        </h3>
        <p className="mt-2 text-sm text-muted max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-fg">{name}</strong>. Your note regarding{" "}
          <span className="font-mono text-accent">[{topic}]</span> has been logged directly for Nyxen. We typically review all developer and audio inquiries within 24 to 48 hours.
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setMessage("");
              setAudioFormat("");
            }}
          >
            Send another dispatch
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-fg tracking-tight">
            Send a Direct Dispatch
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Directly routed to the AudioMorph engineering inbox (Nyxen).
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
          <Sparkle size={12} weight="bold" />
          Average response: &lt; 24h
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-medium text-fg mb-1.5">
            Your Name <span className="text-accent">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Vance"
            className="w-full rounded-xl border border-line bg-surface/50 px-3.5 py-2.5 text-xs text-fg placeholder:text-faint transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-medium text-fg mb-1.5">
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@studio.audio"
            className="w-full rounded-xl border border-line bg-surface/50 px-3.5 py-2.5 text-xs text-fg placeholder:text-faint transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Topic */}
        <div>
          <label htmlFor="contact-topic" className="block text-xs font-medium text-fg mb-1.5">
            Subject Category <span className="text-accent">*</span>
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface/50 px-3.5 py-2.5 text-xs text-fg transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="preset-request">Sound Preset Request (New DSP curve)</option>
            <option value="audio-bug">Audio DSP Glitch / Decoding Bug Report</option>
            <option value="partnership">Audio Engineering Collaboration with Nyxen</option>
            <option value="feature-request">Studio Interface / Tool Feature Request</option>
            <option value="other">General Feedback / Press</option>
          </select>
        </div>

        {/* Optional Audio Format / Browser */}
        <div>
          <label htmlFor="contact-format" className="block text-xs font-medium text-fg mb-1.5">
            Browser / OS / Audio Format <span className="text-faint font-normal">(Optional)</span>
          </label>
          <input
            id="contact-format"
            type="text"
            value={audioFormat}
            onChange={(e) => setAudioFormat(e.target.value)}
            placeholder="e.g. Chrome 132 / macOS / WAV 24-bit"
            className="w-full rounded-xl border border-line bg-surface/50 px-3.5 py-2.5 text-xs text-fg placeholder:text-faint transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="block text-xs font-medium text-fg mb-1.5">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your request, the exact sound you are trying to sculpt, or any audio behavior you encountered..."
            className="w-full rounded-xl border border-line bg-surface/50 p-3.5 text-xs text-fg placeholder:text-faint transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-4">
        <p className="flex items-center gap-1.5 text-[11px] text-faint">
          <WarningCircle size={14} className="text-muted shrink-0" />
          <span>Zero telemetry or spam. Your email is never shared.</span>
        </p>

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <span>Sending dispatch…</span>
          ) : (
            <>
              <span>Dispatch Message</span>
              <PaperPlaneTilt size={14} weight="bold" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

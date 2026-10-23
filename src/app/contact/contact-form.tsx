"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  Info,
  CircleNotch,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { contactFormLimiter } from "@/lib/rate-limiter";

interface DeliveryResponse {
  success: boolean;
  delivered?: boolean;
  simulated?: boolean;
  message?: string;
  issues?: Array<{ field: string; message: string }>;
  received?: { name: string; topic: string; timestamp: string };
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General Question");
  const [message, setMessage] = useState("");
  const [audioFormat, setAudioFormat] = useState("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<DeliveryResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return;
    }

    // Rate-limiting check to prevent accidental rapid duplicate clicks
    const rateCheck = contactFormLimiter.check();
    if (!rateCheck.allowed) {
      toast.error(rateCheck.reason || "Dispatch rate limit reached. Please wait a moment.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
          audioFormat: audioFormat.trim() || undefined,
          website: websiteHoneypot.trim() || undefined,
        }),
      });

      const data: DeliveryResponse = await response.json().catch(() => ({
        success: false,
        message: "Failed to parse server response.",
      }));

      if (!response.ok || !data.success) {
        if (response.status === 429) {
          toast.error(data.message || "Too many dispatches. Please wait before retrying.");
        } else if (data.issues && data.issues.length > 0) {
          toast.error(data.issues[0].message || "Invalid input data.");
        } else {
          toast.error(data.message || "Failed to dispatch message. Your text has been preserved.");
        }
        setSubmitting(false);
        return;
      }

      // Successconfirmed by server
      setSubmitting(false);
      setSubmissionResult(data);
      toast.success("Message received by Audify dispatch.");
    } catch {
      setSubmitting(false);
      toast.error("Network error. Your message text has been preserved — please check your connection and retry.");
    }
  };

  if (submissionResult) {
    const isLiveDelivered = submissionResult.delivered === true;
    const isSimulated = submissionResult.simulated === true;

    return (
      <div
        role="status"
        aria-live="polite"
        className="surface-card rounded-2xl border border-line bg-surface p-7 sm:p-9 text-center space-y-4 shadow-sm"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500">
          <CheckCircle size={28} weight="duotone" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-fg tracking-tight">
            {isLiveDelivered ? "Message Delivered" : "Submission Received"}
          </h3>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-fg">{name}</strong>. Your note regarding{" "}
            <span className="font-mono text-primary font-semibold">[{topic}]</span> has been logged.
          </p>
        </div>

        {/* Honest Delivery Status Box */}
        <div className="rounded-xl border border-line bg-canvas p-4 text-xs text-muted max-w-md mx-auto text-left space-y-2">
          {isLiveDelivered ? (
            <p className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle size={15} className="shrink-0 mt-0.5" weight="fill" />
              <span>Directly delivered to the engineering inbox. We review inquiries within 24 to 48 hours.</span>
            </p>
          ) : isSimulated ? (
            <p className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
              <Info size={15} className="shrink-0 mt-0.5" />
              <span>
                Processed in local simulation mode (outbound email delivery provider is not configured). For urgent questions, email{" "}
                <a href="mailto:hello@nyxen.in" className="underline font-semibold text-fg">
                  hello@nyxen.in
                </a>{" "}
                directly.
              </span>
            </p>
          ) : (
            <p className="flex items-start gap-2 text-muted">
              <Info size={15} className="shrink-0 mt-0.5" />
              <span>Message recorded in local application logs.</span>
            </p>
          )}

          <div className="pt-2 border-t border-line font-mono text-[11px] text-faint flex justify-between">
            <span>Timestamp:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmissionResult(null);
              setMessage("");
              setAudioFormat("");
            }}
            className="text-xs"
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="surface-card rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-5 shadow-xs"
    >
      <div className="border-b border-line pb-3.5">
        <h2 className="text-base font-bold text-fg tracking-tight">
          Send a Direct Message
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Reach the Audify creators for support, feedback, or collaborations.
        </p>
      </div>

      {/* Hidden honeypot field for bot suppression */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website-field">Leave this empty</label>
        <input
          id="website-field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={websiteHoneypot}
          onChange={(e) => setWebsiteHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-fg mb-1">
            Your Name <span className="text-primary font-bold" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            aria-required="true"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Vance"
            disabled={submitting}
            className="h-9 w-full rounded-xl border border-line bg-canvas px-3 text-xs text-fg placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-fg mb-1">
            Email Address <span className="text-primary font-bold" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@studio.audio"
            disabled={submitting}
            className="h-9 w-full rounded-xl border border-line bg-canvas px-3 text-xs text-fg placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
          />
        </div>

        {/* Reason for Contact */}
        <div>
          <label htmlFor="contact-topic" className="block text-xs font-semibold text-fg mb-1">
            Reason for Contact <span className="text-primary font-bold" aria-hidden="true">*</span>
          </label>
          <select
            id="contact-topic"
            required
            aria-required="true"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={submitting}
            className="h-9 w-full rounded-xl border border-line bg-canvas px-2.5 text-xs text-fg focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer disabled:opacity-60"
          >
            <option value="General Question">General Question</option>
            <option value="Technical Support">Technical Support (DSP / Browser)</option>
            <option value="Feedback">Feedback &amp; Sound Suggestions</option>
            <option value="Partnership">Partnership &amp; Music Collaboration</option>
            <option value="Bug Report / Issue">Bug Report / DSP Glitch</option>
            <option value="New Preset Request">New Preset Request</option>
          </select>
        </div>

        {/* Optional Environment / Audio Details */}
        <div>
          <label htmlFor="contact-format" className="block text-xs font-semibold text-fg mb-1">
            Audio Format / Browser <span className="text-muted font-normal text-[11px]">(Optional)</span>
          </label>
          <input
            id="contact-format"
            type="text"
            value={audioFormat}
            onChange={(e) => setAudioFormat(e.target.value)}
            placeholder="e.g. Chrome / macOS / WAV 24-bit"
            disabled={submitting}
            className="h-9 w-full rounded-xl border border-line bg-canvas px-3 text-xs text-fg placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="block text-xs font-semibold text-fg mb-1">
            Message <span className="text-primary font-bold" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            aria-required="true"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your inquiry, the sound you are trying to sculpt, or any issue you encountered..."
            disabled={submitting}
            className="w-full rounded-xl border border-line bg-canvas p-3 text-xs text-fg placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary transition-colors leading-relaxed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line pt-4">
        <p className="flex items-center gap-1.5 text-[11px] text-muted">
          <WarningCircle size={13} className="shrink-0 text-faint" />
          <span>Never shared with third parties. Zero marketing spam.</span>
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto h-9 text-xs px-4"
        >
          {submitting ? (
            <>
              <CircleNotch size={14} className="animate-spin" />
              <span>Sending message…</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <PaperPlaneTilt size={13} weight="bold" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

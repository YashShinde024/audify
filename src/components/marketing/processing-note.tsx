import { Cpu, ShieldCheck, Lightning } from "@phosphor-icons/react/dist/ssr";

export function ProcessingNote() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
      <div>
        <p className="eyebrow text-accent">Architecture</p>
        <h3 className="display-title mt-2 text-2xl sm:text-3xl text-fg">
          Client-side audio DSP.
          <br />
          No uploads. Ever.
        </h3>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted max-w-md">
          Audify executes audio transformations entirely within your browser&apos;s memory using the
          Web Audio API. Your tracks never leave your computer, preserving absolute privacy and eliminating server queue wait times.
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        <ProcessingCard
          icon={<ShieldCheck aria-hidden="true" size={18} weight="duotone" className="text-accent" />}
          term="100% Private"
          detail="Decoded and rendered in your browser tab. No server logs, no cloud storage, no audio telemetry."
        />
        <ProcessingCard
          icon={<Cpu aria-hidden="true" size={18} weight="duotone" className="text-accent" />}
          term="Hardware DSP"
          detail="Uses multi-threaded native browser audio buffers (OfflineAudioContext) for rapid rendering."
        />
        <ProcessingCard
          icon={<Lightning aria-hidden="true" size={18} weight="duotone" className="text-accent" />}
          term="Instant Auditioning"
          detail="Instant A/B before-and-after comparison with zero streaming latency."
        />
      </dl>
    </div>
  );
}

function ProcessingCard({ icon, term, detail }: { icon: React.ReactNode; term: string; detail: string }) {
  return (
    <div className="rounded-xl border border-line bg-canvas p-4">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface">
        {icon}
      </span>
      <dt className="mt-3 text-xs font-semibold text-fg">{term}</dt>
      <dd className="mt-1 text-[11px] leading-relaxed text-muted">{detail}</dd>
    </div>
  );
}

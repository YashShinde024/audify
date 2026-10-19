import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  art?: string; // Kept for backwards compatibility
  wide?: boolean;
}

export function PageHeader({ eyebrow, title, lead, wide = false }: PageHeaderProps) {
  return (
    <header className="border-b border-line pb-8 sm:pb-12">
      <div className={wide ? "max-w-3xl" : "max-w-2xl"}>
        <p className="eyebrow flex items-center gap-2 text-violet">
          <span className="h-1.5 w-1.5 rounded-full bg-violet" />
          {eyebrow}
        </p>
        <h1 className="display-title mt-3 text-3xl sm:text-4xl lg:text-5xl text-fg">
          {title}
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted">
          {lead}
        </p>
      </div>
    </header>
  );
}

/** Clean neutral section divider */
export function SectionSeam() {
  return <div aria-hidden="true" className="my-8 sm:my-10 h-px bg-line" />;
}

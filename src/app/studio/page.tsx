import { Suspense } from "react";
import { EditorShell } from "@/components/editor/editor-shell";
import { StudioInitializer } from "@/components/editor/studio-initializer";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Studio — Audify Browser Audio DSP Workstation",
  description:
    "The Audify dedicated audio workspace: load audio, apply DSP presets and effect parameters, audition with authentic peak tracking, and download finished files.",
  alternates: {
    canonical: `${siteConfig.url}/studio`,
  },
  openGraph: {
    title: "Studio — Audify Browser Audio DSP Workstation",
    description:
      "Load audio, apply DSP presets and effect parameters, audition with authentic peak tracking, and download finished files.",
    url: `${siteConfig.url}/studio`,
  },
};

export default function StudioPage() {
  return (
    <div className="bg-canvas min-h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden">
      <Suspense fallback={null}>
        <StudioInitializer />
      </Suspense>
      <EditorShell />
    </div>
  );
}

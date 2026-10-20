import { Suspense } from "react";
import { EditorShell } from "@/components/editor/editor-shell";
import { StudioInitializer } from "@/components/editor/studio-initializer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio — AudioMorph Professional Audio Processing",
  description:
    "The AudioMorph dedicated audio workspace: load audio, apply DSP presets and effect parameters, audition with authentic peak tracking, and download finished files.",
};

export default function StudioPage() {
  return (
    <div className="bg-canvas min-h-[calc(100vh-4rem)]">
      <Suspense fallback={null}>
        <StudioInitializer />
      </Suspense>
      <EditorShell />
    </div>
  );
}

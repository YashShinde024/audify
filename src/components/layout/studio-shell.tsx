import { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { WaveField } from "@/components/marketing/wave-field";
import { CookieBanner } from "./cookie-banner";
import { FloatingAudioController } from "./floating-audio-controller";

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-canvas text-fg overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Global Background Ambient Continuous Wave Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <WaveField className="opacity-45 dark:opacity-60" />
      </div>

      {/* Futuristic Floating Dynamic Island Navbar */}
      <SiteHeader />

      {/* Main viewport area */}
      <main id="main" className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      {/* Site Footer */}
      <SiteFooter />

      {/* Floating Audio & Volume Controller (when audio is active) */}
      <FloatingAudioController />

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}

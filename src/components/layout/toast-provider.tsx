"use client";

import { Toaster } from "sonner";

/** Shared toast outlet mounted once at the root layout — dark atmospheric theming. */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        duration: 4500,
        style: {
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          background: "#15131f",
          color: "#f7f5ff",
          border: "1px solid #2a2640",
          borderRadius: "9999px",
        },
      }}
    />
  );
}

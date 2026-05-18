"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}

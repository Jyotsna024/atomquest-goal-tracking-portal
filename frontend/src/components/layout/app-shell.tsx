"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Navbar } from "@/components/navbar/navbar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isLoginPage = pathname === "/login" || pathname === "/";

  // Redirect to login only after auth state is determined
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  // Listen for sidebar collapse state changes via DOM observation
  useEffect(() => {
    if (!isAuthenticated || isLoginPage) return;

    const checkSidebar = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        setCollapsed(sidebar.offsetWidth < 100);
      }
    };

    checkSidebar();

    const observer = new MutationObserver(checkSidebar);
    const sidebar = document.querySelector("aside");
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
    }
    return () => observer.disconnect();
  }, [isAuthenticated, isLoginPage]);

  // Login page — no shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Still loading auth state — show skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-8">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Not authenticated after loading — render nothing (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? 68 : 260 }}
      >
        <Navbar />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

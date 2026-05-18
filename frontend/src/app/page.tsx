"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      if (role === "manager") router.replace("/manager");
      else if (role === "admin") router.replace("/admin");
      else router.replace("/employee");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, role, router]);

  return null;
}

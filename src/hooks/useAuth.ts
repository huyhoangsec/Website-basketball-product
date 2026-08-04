"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: "admin" | "coach") {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as { name?: string; email?: string; role?: string; id?: string } | undefined;
  const role = user?.role;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (status === "loading") return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (requiredRole && role !== requiredRole && role !== "admin") {
      router.push("/login");
    }
  }, [status, isAuthenticated, role, requiredRole, router]);

  return {
    user,
    role,
    isLoading,
    isAuthenticated,
    isAdmin: () => role === "admin",
    isCoach: () => role === "coach",
  };
}

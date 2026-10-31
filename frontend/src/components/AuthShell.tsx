"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { ApiError, clearCurrentUser, fetchCurrentUser, setCurrentUser } from "@/lib/api";

const publicPaths = new Set(["/login", "/register"]);

export function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = publicPaths.has(pathname);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPublicPath) return;

    let active = true;
    const handleExpiredSession = () => {
      clearCurrentUser();
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    };
    setAuthorized(false);
    setError("");
    window.addEventListener("careerpivot-session-expired", handleExpiredSession);
    fetchCurrentUser()
      .then((profile) => {
        if (!active) return;
        setCurrentUser(profile);
        setAuthorized(true);
      })
      .catch((cause) => {
        if (!active) return;
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        setError(cause instanceof Error ? cause.message : "Could not verify your session.");
      });

    return () => {
      active = false;
      window.removeEventListener("careerpivot-session-expired", handleExpiredSession);
    };
  }, [isPublicPath, pathname, router]);

  if (isPublicPath) {
    return <main className="min-h-screen w-full bg-[#090D16] p-4 text-slate-100 sm:p-8">{children}</main>;
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#090D16] p-6 text-sm text-slate-300">
        {error ? (
          <div className="max-w-lg space-y-4 text-center">
            <p role="alert" className="text-rose-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <p>Verifying your sign-in...</p>
        )}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </>
  );
}

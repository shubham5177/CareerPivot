"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { clearCurrentUser, getCurrentUserName, logoutUser } from "@/lib/api";

export function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  useEffect(() => {
    setUserName(getCurrentUserName());
    const syncName = () => setUserName(getCurrentUserName());
    window.addEventListener("storage", syncName);
    window.addEventListener("careerpivot-profile-updated", syncName);
    return () => {
      window.removeEventListener("storage", syncName);
      window.removeEventListener("careerpivot-profile-updated", syncName);
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    setLogoutError("");
    try {
      await logoutUser();
      clearCurrentUser();
      router.replace("/login");
    } catch (cause) {
      setLogoutError(cause instanceof Error ? cause.message : "Could not sign out.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="relative h-16 border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">FastAPI ML Engine Online</span>
          <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 font-mono">
            3 Models Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/resume"
          className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upload Resume</span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white leading-none">{userName}</p>
            <p className="text-[10px] text-slate-400 leading-tight">Career Profile</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
      {logoutError && <p role="alert" className="absolute right-6 top-full mt-2 rounded-lg border border-rose-500/30 bg-slate-950 px-3 py-2 text-xs text-rose-300">{logoutError}</p>}
    </header>
  );
}

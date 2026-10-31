"use client";

import Link from "next/link";
import { Bell, Sparkles, User, ExternalLink, Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
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
        <Link
          href="/profile"
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            AR
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white leading-none group-hover:text-blue-400 transition-colors">Alex Rivera</p>
            <p className="text-[10px] text-slate-400 leading-tight">Profile & Goals</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Compass,
  BarChart3,
  MapPin,
  FolderGit2,
  Mic,
  Briefcase,
  UserRound,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Overview", href: "/", icon: Sparkles },
  { name: "My Profile", href: "/profile", icon: UserRound },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", href: "/resume", icon: FileText, badge: "ML" },
  { name: "Career Selection", href: "/career", icon: Compass },
  { name: "Skill Gap Matrix", href: "/skill-gap", icon: BarChart3, badge: "TF-IDF" },
  { name: "Learning Roadmap", href: "/roadmap", icon: MapPin },
  { name: "Portfolio Projects", href: "/projects", icon: FolderGit2 },
  { name: "Mock Interview", href: "/interview", icon: Mic, badge: "NLP" },
  { name: "Job Tracker", href: "/applications", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B1120] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090D16] rounded-xl flex items-center justify-center group-hover:bg-transparent transition-colors">
              <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight">CAREERPIVOT</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Job Readiness Coach</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Coaching Workspace
        </div>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <Link href="/career" className="m-3 rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-900/50 p-3.5">
        <span className="text-[11px] font-semibold text-slate-400">Career Target</span>
        <span className="mt-1 flex items-center justify-between text-xs font-semibold text-white">
          Choose or update a role
          <ChevronRight className="h-3.5 w-3.5 text-blue-400" />
        </span>
      </Link>
    </aside>
  );
}

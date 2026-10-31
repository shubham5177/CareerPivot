"use client";

import Link from "next/link";
import {
  TrendingUp,
  FileText,
  BarChart3,
  MapPin,
  Mic,
  Briefcase,
  FolderGit2,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  User,
  Compass,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Model 1: Resume Skill Extraction",
      desc: "Instant multi-format parsing (PDF/DOCX) with supervised classification across 8 domain taxonomies.",
      icon: FileText,
      href: "/resume",
      badge: "Supervised Classifier",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    },
    {
      title: "Model 2: TF-IDF Job Matching",
      desc: "Calibrated similarity engine comparing candidate skills against job requirements with Pearson r > 0.97.",
      icon: BarChart3,
      href: "/skill-gap",
      badge: "TF-IDF + Cosine Sim",
      color: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400",
    },
    {
      title: "Model 3: Mock Interview Evaluator",
      desc: "Supervised 4-tier answer quality grading with explainable keyword coverage, structure scoring & rubrics.",
      icon: Mic,
      href: "/interview",
      badge: "Multinomial NLP",
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    },
    {
      title: "Personalized Learning Roadmaps",
      desc: "Dynamic 8-week mastery curriculum that automatically recalculates milestones as you complete tasks.",
      icon: MapPin,
      href: "/roadmap",
      badge: "Adaptive Engine",
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Portfolio Project Recommendations",
      desc: "Curated architectural projects targeting your specific skill gaps with starter guides and deliverables.",
      icon: FolderGit2,
      href: "/projects",
      badge: "Project Studio",
      color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400",
    },
    {
      title: "Job Application Tracker",
      desc: "Application pipeline analytics tracking interview conversion rates, response funnels, and offer stages.",
      icon: Briefcase,
      href: "/applications",
      badge: "Funnel Analytics",
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0B1120] to-[#090D16] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous AI/ML Career Intelligence • Zero Paid APIs</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Transition Into Your Dream Tech Career With{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Precision ML Coaching
            </span>
          </h1>

          <p className="text-base lg:text-lg text-slate-300 leading-relaxed">
            CAREERPIVOT AI bridges the gap between where your skills are today and what top employers demand tomorrow.
            Analyze resumes, quantify technical gaps, master weekly tailored roadmaps, and practice with transparent ML mock interviews.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/profile"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <span>1. Start Registration & Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Career Dashboard</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3 Reproducible Scikit-Learn Pipelines</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Offline & Transparent Rubrics</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Dynamic Progress Calibration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Tool Modules Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Coaching Ecosystem & ML Engines</h2>
          <p className="text-sm text-slate-400 mt-1">
            Engineered with transparent machine learning models, relational SQLite storage, and responsive analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                href={feat.href}
                className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 transition-all flex flex-col justify-between space-y-4 glow-card"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 pt-2 border-t border-slate-800/60 group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Complete User Workflow Stepper */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              COMPLETE 10-STEP USER JOURNEY
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">From Career Pivot to Job Offer</h2>
            <p className="text-xs text-slate-400">
              Registration → Profile Creation → Resume Upload → Resume Analysis → Career Selection → Skill Gap Analysis → Learning Roadmap → Portfolio Projects → Mock Interview → Job Tracking → Progress Dashboard → Updated Recommendations.
            </p>
          </div>
          <Link
            href="/profile"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>Begin at Step 1 (Profile)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { step: "1", title: "Registration & Profile", desc: "Enter name, email, education, current skills, & transition goals.", href: "/profile", icon: User },
            { step: "2", title: "Resume Upload", desc: "Upload PDF or DOCX file for automatic extraction.", href: "/resume", icon: FileText },
            { step: "3", title: "Target Career Choice", desc: "Select from 9 tech roles or specify custom job criteria.", href: "/career", icon: Compass },
            { step: "4", title: "Skill Gap Analysis", desc: "Model 2 TF-IDF similarity calculates match score and missing skills.", href: "/skill-gap", icon: BarChart3 },
            { step: "5", title: "Personalized Roadmap", desc: "Follow dynamic 8-week structured curriculum with tasks & resources.", href: "/roadmap", icon: MapPin },
            { step: "6", title: "Portfolio Projects", desc: "Build gap-targeted portfolio projects with architectures.", href: "/projects", icon: FolderGit2 },
            { step: "7", title: "Mock Interview", desc: "Type answers graded by Model 3 with rubrics & missing concepts.", href: "/interview", icon: Mic },
            { step: "8", title: "Job Application Tracker", desc: "Track opportunities, screening rounds, and conversion metrics.", href: "/applications", icon: Briefcase },
            { step: "9", title: "Progress Dashboard", desc: "Review unified readiness scores, radar balance, & milestones.", href: "/dashboard", icon: LayoutDashboard },
            { step: "10", title: "Updated Recommendations", desc: "Adaptive feedback automatically updates based on progress.", href: "/roadmap", icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.step}
                href={item.href}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between space-y-2 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      STEP {item.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-1 text-[10px] font-semibold text-blue-400 group-hover:underline flex items-center gap-0.5">
                  <span>Launch Step</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Target Careers Supported Banner */}
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Supported Career Transitions</h3>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto">
          Frontend Developer • Backend Developer • Full Stack Developer • Python Developer • Data Analyst • Data Scientist • Machine Learning Engineer • Cybersecurity Analyst • Cloud Engineer • Custom Roles
        </p>
        <div className="pt-2">
          <Link
            href="/career"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5"
          >
            <span>Browse All Target Roles & Requirements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

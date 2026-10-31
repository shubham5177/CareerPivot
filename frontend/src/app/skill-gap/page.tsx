"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  FolderGit2,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import {
  evaluateJobMatch,
  fetchLatestResume,
  fetchRoles,
  fetchUserProfile,
  getCurrentUserId,
  getCurrentTargetRoleId,
} from "@/lib/api";
import { JobMatchResult, JobRole } from "@/types";
import { getScoreColor } from "@/lib/utils";

export default function SkillGapPage() {
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(() =>
    typeof window === "undefined"
      ? "role-fullstack"
      : new URLSearchParams(window.location.search).get("role") || getCurrentTargetRoleId()
  );
  const [loading, setLoading] = useState(true);
  const [candidateSkills, setCandidateSkills] = useState<string[]>([]);
  const [error, setError] = useState("");

  const runAnalysis = async (roleId: string) => {
    setLoading(true);
    setError("");
    try {
      const profile = await fetchUserProfile();
      let skills = profile.current_skills;
      try {
        const resume = await fetchLatestResume();
        if (resume.extracted_skills?.length) {
          skills = resume.extracted_skills.map((skill: string | { name: string }) =>
            typeof skill === "string" ? skill : skill.name
          );
        }
      } catch (cause) {
        if (!(cause instanceof Error) || !cause.message.includes("No resume found")) {
          throw cause;
        }
      }
      setCandidateSkills(skills);
      const res = await evaluateJobMatch({
        user_id: getCurrentUserId(),
        resume_skills: skills,
        job_role_id: roleId,
      });
      setMatchResult(res);
    } catch (cause) {
      setMatchResult(null);
      setError(cause instanceof Error ? cause.message : "Could not calculate your skill match.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles().then((data) => setRoles(data)).catch((cause) => setError(cause.message));
    runAnalysis(selectedRole);
  }, []);

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    runAnalysis(roleId);
  };

  // Prepare radar chart data from category breakdown
  const radarData = matchResult?.category_breakdown
    ? Object.entries(matchResult.category_breakdown).map(([cat, counts]) => ({
        subject: cat.replace("_", " ").toUpperCase(),
        Verified: counts.matched,
        Required: counts.total,
        fullMark: Math.max(counts.total + 1, 3),
      }))
    : [];

  const score = matchResult?.match_score ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Skill Gap Matrix</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Model 2 TF-IDF Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Comparing candidate verified skills against employer requirements with calibrated relevance ranking.
          </p>
        </div>

        {/* Role Selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Target:</span>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => runAnalysis(selectedRole)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Recalculate match"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Top Banner: Score & Suitability Narrative */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0B1120] to-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Match Score Display */}
        <div className="flex items-center gap-5 border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#1E293B"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={score >= 80 ? "#10B981" : score >= 60 ? "#3B82F6" : "#F43F5E"}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-xl font-extrabold ${getScoreColor(score)}`}>
                {score}%
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">Match</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Readiness Status
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {score >= 80 ? "Interview Ready" : score >= 60 ? "Solid Foundation" : "Pivot In Progress"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Skill gap is {matchResult?.skill_gap_percentage ?? 0}%.
            </p>
          </div>
        </div>

        {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

        {/* Explainable Suitability Narrative */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Explainable AI Suitability Breakdown</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {matchResult?.suitability_explanation}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400">
            <span>
              <strong className="text-emerald-400">{matchResult?.matched_skills.length}</strong> Matched Skills
            </span>
            <span>•</span>
            <span>
              <strong className="text-purple-400">{matchResult?.missing_skills.length}</strong> Target Gaps
            </span>
            <span>•</span>
            <Link href="/roadmap" className="text-blue-400 hover:underline font-medium">
              Open Personalized Roadmap →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart & Missing Skills Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Domain Competency Balance</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified resume coverage vs job requirements by domain
            </p>
          </div>

          <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis stroke="#475569" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                />
                <Radar
                  name="Verified Skills"
                  dataKey="Verified"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Required"
                  dataKey="Required"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500/60 border border-blue-500" />
              <span className="text-slate-300">Your Skills</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500" />
              <span className="text-slate-300">Role Target</span>
            </div>
          </div>
        </div>

        {/* Prioritized Missing Skills Matrix */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Prioritized Skill Gap Action Plan</h3>
              <p className="text-xs text-slate-400">
                Sorted by hiring manager impact: Essential → Important → Nice-to-have
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {matchResult?.missing_skills.length} Gaps To Close
            </span>
          </div>

          <div className="space-y-3">
            {(matchResult?.missing_skills || []).map((gap, idx) => {
              const isEssential = gap.importance === "Essential";
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{gap.skill_name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          isEssential
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {gap.importance}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        {gap.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{gap.recommended_action}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/roadmap"
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Roadmap</span>
                    </Link>
                    <Link
                      href="/projects"
                      className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <FolderGit2 className="w-3 h-3" />
                      <span>Project</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matched Skills Preview */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Already Verified in Your Profile
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(matchResult?.matched_skills || []).map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

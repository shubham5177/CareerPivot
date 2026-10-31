"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Code,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { fetchProjects, fetchRoles, getCurrentTargetRoleId } from "@/lib/api";
import { PortfolioProject, JobRole } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(getCurrentTargetRoleId);
  const [selectedDiff, setSelectedDiff] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadProjects = async (roleId?: string, diff?: string) => {
    setLoading(true);
    try {
      const data = await fetchProjects(roleId || undefined, diff !== "all" ? diff : undefined);
      setProjects(data);
    } catch (e) {
      console.error(e);
      // Fallback projects
      setProjects([
        {
          id: "proj-1",
          job_role_id: "role-frontend",
          title: "NextGen Analytics SaaS Dashboard",
          difficulty: "Intermediate",
          summary: "Build a high-performance responsive metrics dashboard with real-time charting, customizable widgets, dark/light theme, and role-based views.",
          required_technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"],
          skills_gained: ["Component Architecture", "Data Visualization", "State Management", "Performance Optimization"],
          expected_outcome: "Production-ready web application hosted on Vercel with Lighthouse score > 95.",
          architecture_overview: "Next.js App Router frontend consuming REST endpoints with optimistic UI updates and responsive grid layout.",
          status: "recommended",
        },
        {
          id: "proj-2",
          job_role_id: "role-backend",
          title: "Scalable Event-Driven Payment Microservice",
          difficulty: "Advanced",
          summary: "Implement a resilient payment and invoice processing microservice with idempotency keys, rate limiting, and webhook dispatching.",
          required_technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
          skills_gained: ["Asynchronous Programming", "Database Transactions", "Distributed Caching", "API Security"],
          expected_outcome: "Containerized API handling 1,500 requests/sec with automated test coverage exceeding 90%.",
          architecture_overview: "FastAPI async handlers with Celery background workers, Redis pub/sub, and PostgreSQL ACID transactions.",
          status: "recommended",
        },
        {
          id: "proj-3",
          job_role_id: "role-data-scientist",
          title: "Customer Churn Prediction & Explainability Engine",
          difficulty: "Intermediate",
          summary: "Train predictive classification models on telecom customer data with SHAP value interpretability and an interactive Streamlit inference tool.",
          required_technologies: ["Python", "Pandas", "Scikit-Learn", "SHAP", "Plotly"],
          skills_gained: ["Feature Engineering", "Model Evaluation (ROC-AUC)", "Model Interpretability", "Business KPI Mapping"],
          expected_outcome: "Interactive web model predicting churn probability with actionable feature importance for retention teams.",
          architecture_overview: "Data pipeline extracting behavioral features, training XGBoost/RandomForest, serving SHAP waterfall explanations.",
          status: "recommended",
        },
        {
          id: "proj-4",
          job_role_id: "role-ml-engineer",
          title: "End-to-End LLM RAG Document Intelligence Platform",
          difficulty: "Advanced",
          summary: "Build a production Retrieval-Augmented Generation system with hybrid vector search, reranking, and citation tracking.",
          required_technologies: ["Python", "FastAPI", "Docker", "PyTorch", "NLP"],
          skills_gained: ["Vector Embeddings", "RAG Pipeline Architecture", "Latency Optimization", "Model Monitoring"],
          expected_outcome: "Deployed containerized API serving document Q&A with sub-500ms retrieval latency.",
          architecture_overview: "Chunking and embedding pipeline indexing to vector store with FastAPI query orchestrator.",
          status: "recommended",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles().then((data) => setRoles(data)).catch(() => {});
    loadProjects(selectedRole, selectedDiff);
  }, []);

  const handleFilter = (roleId: string, diff: string) => {
    setSelectedRole(roleId);
    setSelectedDiff(diff);
    loadProjects(roleId === "all" ? undefined : roleId, diff);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Portfolio Project Recommendations</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Gap-Targeted Projects
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Build production-grade projects designed to prove competency in your specific target skills.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => handleFilter(e.target.value, selectedDiff)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Job Pathways</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>

          <select
            value={selectedDiff}
            onChange={(e) => handleFilter(selectedRole, e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const diffBadgeColor =
            proj.difficulty === "Advanced"
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : proj.difficulty === "Intermediate"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

          return (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 glow-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${diffBadgeColor}`}>
                    {proj.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Portfolio Asset</span>
                </div>

                <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.summary}</p>

                {/* Tech Badges */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Required Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.required_technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Gained */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Verified Competencies Demonstrated
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.skills_gained.map((sg) => (
                      <span
                        key={sg}
                        className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium"
                      >
                        {sg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Architecture Overview */}
                {proj.architecture_overview && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Architecture Spec:</span>
                    <p>{proj.architecture_overview}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-[240px] text-[11px]">{proj.expected_outcome}</span>
                </div>
                <Link
                  href="/roadmap"
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>Attach to Week</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

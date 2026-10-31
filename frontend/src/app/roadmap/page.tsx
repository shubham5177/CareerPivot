"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Code,
  Milestone,
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { fetchRoadmap, toggleRoadmapTask } from "@/lib/api";
import { LearningRoadmap, RoadmapTask } from "@/types";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState<number>(4);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const data = await fetchRoadmap();
      setRoadmap(data);
      // Auto-set active week to first uncompleted task
      const firstIncomp = data.tasks.find((t: RoadmapTask) => !t.is_completed);
      if (firstIncomp) setActiveWeek(firstIncomp.week_number);
    } catch (e) {
      console.error(e);
      // Fallback 8-week structured roadmap
      setRoadmap({
        id: "rdm-demo-01",
        user_id: "usr-demo-01",
        job_role_id: "role-fullstack",
        role_title: "Full Stack Developer",
        title: "8-Week Full Stack Engineer Transition Roadmap",
        summary: "Structured weekly curriculum bridging React frontend skills into enterprise TypeScript, Node.js microservices, PostgreSQL data modeling, and Docker deployment.",
        total_weeks: 8,
        progress_percentage: 37.5,
        status: "in_progress",
        tasks: [
          {
            id: "task-w1",
            roadmap_id: "rdm-demo-01",
            week_number: 1,
            title: "TypeScript Deep Dive for Frontend & Backend",
            description: "Master static typing, generics, interfaces, union types, and TS compiler configuration in modern web apps.",
            topics: ["TypeScript Generics", "Strict Type Checking", "Utility Types (Pick, Omit, Partial)", "TS with React Components"],
            practice_activities: ["Refactor an existing React app to TypeScript with zero any types", "Implement custom generic hook for API requests"],
            project_milestone: "Fully typed client repository",
            recommended_resources: ["TypeScript Official Handbook", "Total TypeScript by Matt Pocock"],
            is_completed: true,
            completed_at: "2026-10-15 10:00:00",
          },
          {
            id: "task-w2",
            roadmap_id: "rdm-demo-01",
            week_number: 2,
            title: "Next.js 14 App Router & Server Components",
            description: "Understand Server vs Client components, Server Actions, streaming SSR, and SEO-optimized dynamic routing.",
            topics: ["RSC (React Server Components)", "Server Actions & Mutations", "Dynamic Routing & Layouts", "Parallel & Intercepting Routes"],
            practice_activities: ["Build an interactive server-rendered blog with Server Actions", "Implement route caching and revalidation strategies"],
            project_milestone: "Next.js App Router Project",
            recommended_resources: ["Next.js Documentation", "Vercel Academy"],
            is_completed: true,
            completed_at: "2026-10-22 14:30:00",
          },
          {
            id: "task-w3",
            roadmap_id: "rdm-demo-01",
            week_number: 3,
            title: "Relational Database Modeling with PostgreSQL",
            description: "Schema design, normalization, foreign keys, indexing, transactions, and ORM integration.",
            topics: ["Relational Modeling (1-N, N-N)", "Indexes (B-Tree, Hash, GIN)", "ACID Transactions", "Prisma/Drizzle ORM"],
            practice_activities: ["Write complex multi-table JOINs and aggregations", "Profile query execution plan using EXPLAIN ANALYZE"],
            project_milestone: "E-commerce Database Schema & Migrations",
            recommended_resources: ["PostgreSQL Tutorial", "Use The Index, Luke"],
            is_completed: true,
            completed_at: "2026-10-29 18:00:00",
          },
          {
            id: "task-w4",
            roadmap_id: "rdm-demo-01",
            week_number: 4,
            title: "Advanced Backend APIs & Authentication",
            description: "Architect production-grade REST APIs, JWT authentication, refresh tokens, role-based access control, and rate limiting.",
            topics: ["JWT & HttpOnly Cookie Auth", "Role-Based Access Control (RBAC)", "Input Validation & Sanitization", "API Rate Limiting"],
            practice_activities: ["Build an auth microservice with access and refresh tokens", "Implement middleware for authorization"],
            project_milestone: "Secure Authentication Microservice",
            recommended_resources: ["OWASP API Security Top 10", "FastAPI / Express Security Best Practices"],
            is_completed: false,
            completed_at: null,
          },
          {
            id: "task-w5",
            roadmap_id: "rdm-demo-01",
            week_number: 5,
            title: "Docker Containerization & Multi-Stage Builds",
            description: "Containerize full stack applications with optimized Dockerfiles, docker-compose orchestration, and volume persistence.",
            topics: ["Docker Engine Concepts", "Multi-stage Dockerfile optimization", "Docker Compose for local dev", "Environment management"],
            practice_activities: ["Write multi-stage Dockerfile reducing image size under 150MB", "Run frontend + backend + postgres on compose network"],
            project_milestone: "Containerized Local Full Stack Stack",
            recommended_resources: ["Docker Official Getting Started Guide", "Bret Fisher Docker Mastery"],
            is_completed: false,
            completed_at: null,
          },
          {
            id: "task-w6",
            roadmap_id: "rdm-demo-01",
            week_number: 6,
            title: "Caching, Redis & Message Queues",
            description: "Improve latency and handle high throughput with in-memory caching and asynchronous job processing.",
            topics: ["Redis Key-Value & Sets", "Cache-Aside & Write-Through Patterns", "Session Storage", "Background Task Queues"],
            practice_activities: ["Implement cache layer with TTL invalidation", "Build an async email dispatch worker"],
            project_milestone: "High-Throughput Caching Layer",
            recommended_resources: ["Redis University", "Designing Data-Intensive Applications"],
            is_completed: false,
            completed_at: null,
          },
          {
            id: "task-w7",
            roadmap_id: "rdm-demo-01",
            week_number: 7,
            title: "Automated CI/CD & Cloud Deployment",
            description: "Deploy full-stack services with automated testing, linting, GitHub Actions CI/CD, and cloud hosting.",
            topics: ["GitHub Actions Workflows", "Automated Unit & Integration Tests", "Cloud Deployment (AWS/Render/Vercel)", "Zero-downtime deployment"],
            practice_activities: ["Set up pipeline that runs lint + tests on PR", "Automate staging deploy on git push"],
            project_milestone: "Live CI/CD Deployment Pipeline",
            recommended_resources: ["GitHub Actions Docs", "The Twelve-Factor App"],
            is_completed: false,
            completed_at: null,
          },
          {
            id: "task-w8",
            roadmap_id: "rdm-demo-01",
            week_number: 8,
            title: "Full Capstone Project & System Design",
            description: "Consolidate skills into a portfolio-worthy full-stack product with end-to-end documentation, architecture diagram, and live demo.",
            topics: ["System Architecture Planning", "API Documentation (Swagger/OpenAPI)", "Performance Benchmarking", "Interview Portfolio Preparation"],
            practice_activities: ["Conduct end-to-end load test using k6", "Record 3-minute video walkthrough of technical architecture"],
            project_milestone: "Production Capstone Live Demo",
            recommended_resources: ["System Design Primer", "Full Stack Open"],
            is_completed: false,
            completed_at: null,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleToggleTask = async (task: RoadmapTask) => {
    if (!roadmap) return;
    const newStatus = !task.is_completed;
    setUpdatingTaskId(task.id);

    try {
      await toggleRoadmapTask(task.id, newStatus);
      // Update local state
      const updatedTasks = roadmap.tasks.map((t) =>
        t.id === task.id ? { ...t, is_completed: newStatus } : t
      );
      const completedCount = updatedTasks.filter((t) => t.is_completed).length;
      const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

      setRoadmap({
        ...roadmap,
        progress_percentage: newProgress,
        tasks: updatedTasks,
      });
    } catch (e) {
      console.error(e);
      // Fallback local toggle
      const updatedTasks = roadmap.tasks.map((t) =>
        t.id === task.id ? { ...t, is_completed: newStatus } : t
      );
      const completedCount = updatedTasks.filter((t) => t.is_completed).length;
      setRoadmap({
        ...roadmap,
        progress_percentage: Math.round((completedCount / updatedTasks.length) * 100),
        tasks: updatedTasks,
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const currentTask = roadmap?.tasks.find((t) => t.week_number === activeWeek) || roadmap?.tasks[0];
  const progress = roadmap?.progress_percentage ?? 37.5;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Personalized Learning Roadmap</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Adaptive Curriculum
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Weekly structured path calibrated to close your verified skill gaps for {roadmap?.role_title}.
          </p>
        </div>

        <button
          onClick={loadRoadmap}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors self-start md:self-auto"
          title="Reload roadmap"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Progress & Milestone Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0B1120] to-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Curriculum Trajectory
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{roadmap?.title}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{roadmap?.summary}</p>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-3xl font-black text-white">{progress}%</span>
              <span className="text-xs text-emerald-400 font-semibold">Completed</span>
            </div>
            <span className="text-xs text-slate-400">
              {roadmap?.tasks.filter((t) => t.is_completed).length} of {roadmap?.total_weeks} Weeks Done
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 8-Week Timeline Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {roadmap?.tasks.map((task) => {
          const isActive = activeWeek === task.week_number;
          return (
            <button
              key={task.id}
              onClick={() => setActiveWeek(task.week_number)}
              className={`px-4 py-3 rounded-xl border text-left shrink-0 transition-all flex items-center gap-3 ${
                isActive
                  ? "bg-slate-800 border-blue-500 text-white shadow-md shadow-blue-500/10"
                  : task.is_completed
                  ? "bg-slate-900/70 border-emerald-500/30 text-slate-300"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="shrink-0">
                {task.is_completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Week {task.week_number}
                </span>
                <span className="text-xs font-semibold truncate max-w-[140px] block">
                  {task.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Week Detail Card */}
      {currentTask && (
        <div className="p-6 lg:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  WEEK {currentTask.week_number} MILESTONE
                </span>
                {currentTask.is_completed && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{currentTask.title}</h2>
              <p className="text-xs text-slate-300 mt-1">{currentTask.description}</p>
            </div>

            <button
              onClick={() => handleToggleTask(currentTask)}
              disabled={updatingTaskId === currentTask.id}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all self-start sm:self-auto ${
                currentTask.is_completed
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentTask.is_completed ? "Mark as Incomplete" : "Mark Week as Completed"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Topics */}
            <div className="space-y-3 p-5 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Core Topics & Concepts</span>
              </div>
              <ul className="space-y-2">
                {currentTask.topics.map((topic, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Activities */}
            <div className="space-y-3 p-5 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>Hands-on Practice Exercises</span>
              </div>
              <ul className="space-y-2">
                {currentTask.practice_activities.map((act, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Project Milestone & Recommended Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Project Deliverable */}
            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <Milestone className="w-4 h-4" />
                <span>Tangible Week Milestone</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold">{currentTask.project_milestone}</p>
              <p className="text-[11px] text-slate-400">
                Commit this deliverable to GitHub to showcase continuous proof-of-work in your portfolio.
              </p>
            </div>

            {/* Recommended Resources */}
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <ExternalLink className="w-4 h-4" />
                <span>Curated Learning Resources</span>
              </div>
              <div className="space-y-1.5">
                {currentTask.recommended_resources.map((res, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="hover:text-blue-400 transition-colors">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

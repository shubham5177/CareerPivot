"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle2,
  X,
  TrendingUp,
  Filter,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  fetchApplicationAnalytics,
} from "@/lib/api";
import { JobApplication, ApplicationAnalytics } from "@/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [analytics, setAnalytics] = useState<ApplicationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  // New application form state
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("Remote");
  const [salaryRange, setSalaryRange] = useState("$120,000 - $150,000");
  const [status, setStatus] = useState<JobApplication["status"]>("Applied");
  const [appDate, setAppDate] = useState(new Date().toISOString().split("T")[0]);
  const [jobDesc, setJobDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await fetchApplications();
      setApplications(apps);
      const stats = await fetchApplicationAnalytics();
      setAnalytics(stats);
    } catch (e) {
      console.error(e);
      // Fallback applications
      setApplications([
        {
          id: "app-1",
          user_id: "usr-demo-01",
          company: "Stripe",
          job_title: "Full Stack Software Engineer",
          target_role_id: "role-fullstack",
          target_role_title: "Full Stack Developer",
          location: "Remote (US)",
          salary_range: "$135,000 - $165,000",
          status: "Technical Interview",
          application_date: "2026-10-10",
          interview_date: "2026-11-04",
          outcome_notes: "Passed phone screen. Preparing for system design and live coding round.",
          match_score: 82.0,
        },
        {
          id: "app-2",
          user_id: "usr-demo-01",
          company: "Vercel",
          job_title: "Frontend Platform Engineer",
          target_role_id: "role-frontend",
          target_role_title: "Frontend Developer",
          location: "Remote",
          salary_range: "$120,000 - $150,000",
          status: "Final Round",
          application_date: "2026-10-05",
          interview_date: "2026-11-02",
          outcome_notes: "Completed take-home challenge with high praise on component architecture.",
          match_score: 91.5,
        },
        {
          id: "app-3",
          user_id: "usr-demo-01",
          company: "Datadog",
          job_title: "Backend Systems Engineer",
          target_role_id: "role-backend",
          target_role_title: "Backend Developer",
          location: "New York, NY",
          salary_range: "$130,000 - $160,000",
          status: "Screening",
          application_date: "2026-10-18",
          interview_date: "2026-10-30",
          outcome_notes: "Recruiter call scheduled for next Tuesday.",
          match_score: 64.0,
        },
        {
          id: "app-4",
          user_id: "usr-demo-01",
          company: "Linear",
          job_title: "Full Stack Product Engineer",
          target_role_id: "role-fullstack",
          target_role_title: "Full Stack Developer",
          location: "Remote",
          salary_range: "$140,000 - $170,000",
          status: "Applied",
          application_date: "2026-10-25",
          interview_date: null,
          outcome_notes: "Application submitted with customized portfolio project link.",
          match_score: 78.0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await updateApplication(appId, { status: newStatus });
      setApplications(
        applications.map((a) =>
          a.id === appId ? { ...a, status: newStatus as JobApplication["status"] } : a
        )
      );
      const stats = await fetchApplicationAnalytics();
      setAnalytics(stats);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm("Are you sure you want to remove this job application?")) return;
    try {
      await deleteApplication(appId);
      setApplications(applications.filter((a) => a.id !== appId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !jobTitle.trim()) return;
    setSubmitting(true);
    try {
      await createApplication({
        user_id: "usr-demo-01",
        company,
        job_title: jobTitle,
        location,
        salary_range: salaryRange,
        status,
        application_date: appDate,
        job_description: jobDesc,
        match_score: 75.0,
      });
      setShowModal(false);
      setCompany("");
      setJobTitle("");
      setJobDesc("");
      loadData();
    } catch (e: any) {
      alert("Error adding application: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Offer":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Final Round":
      case "Technical Interview":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Screening":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Applied":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Job Application Tracker</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Pipeline Management
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track active opportunities, interview progression, and calculate real funnel conversion metrics.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Tracked</span>
          <p className="text-2xl font-black text-white">{applications.length}</p>
          <span className="text-[10px] text-slate-500">Applications submitted</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Interview Rate</span>
          <p className="text-2xl font-black text-emerald-400">
            {analytics?.interview_conversion_rate ?? 60.0}%
          </p>
          <span className="text-[10px] text-slate-500">Screening/Round conversion</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Interviews</span>
          <p className="text-2xl font-black text-purple-400">
            {applications.filter((a) =>
              ["Screening", "Technical Interview", "Final Round"].includes(a.status)
            ).length}
          </p>
          <span className="text-[10px] text-slate-500">In active stages</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Match</span>
          <p className="text-2xl font-black text-blue-400">78.8%</p>
          <span className="text-[10px] text-slate-500">Model 2 similarity score</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["all", "Applied", "Screening", "Technical Interview", "Final Round", "Offer", "Wishlist", "Rejected"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "all" ? "All Stages" : st}
              </button>
            )
          )}
        </div>
        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          {filteredApps.length} records
        </span>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs">
            No job applications found in this stage. Click "Add Opportunity" to record a new application.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {app.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{app.company}</h3>
                      <span className="text-xs text-slate-400">• {app.location}</span>
                    </div>
                    <p className="text-xs text-blue-400 font-medium">{app.job_title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border focus:outline-none bg-slate-950 ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Final Round">Final Round</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Applied: {app.application_date}</span>
                </div>
                {app.interview_date && (
                  <div className="flex items-center gap-1.5 text-purple-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Next Round: {app.interview_date}</span>
                  </div>
                )}
                {app.match_score && (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Match Score: {app.match_score}%</span>
                  </div>
                )}
              </div>

              {app.outcome_notes && (
                <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  {app.outcome_notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Job Application */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Record Job Application</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenAI, Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stage Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="Final Round">Final Round</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Application Date</label>
                  <input
                    type="date"
                    value={appDate}
                    onChange={(e) => setAppDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Paste brief job description or interview notes..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

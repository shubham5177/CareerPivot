"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Plus,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Briefcase,
  X,
  Layers,
} from "lucide-react";
import { fetchRoles, createCustomRole } from "@/lib/api";
import { JobRole } from "@/types";

export default function CareerPage() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role-fullstack");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state for custom role
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Software Engineering");
  const [customDesc, setCustomDesc] = useState("");
  const [customSalary, setCustomSalary] = useState("$95,000 - $140,000");
  const [customSkills, setCustomSkills] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (e) {
      console.error(e);
      // Fallback standard roles
      setRoles([
        {
          id: "role-frontend",
          title: "Frontend Developer",
          category: "Software Engineering",
          description: "Builds dynamic, responsive user interfaces and web applications using modern JavaScript/TypeScript frameworks.",
          average_salary_range: "$85,000 - $130,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript", "HTML5 & CSS3"],
        },
        {
          id: "role-backend",
          title: "Backend Developer",
          category: "Software Engineering",
          description: "Architects scalable microservices, robust REST/GraphQL APIs, databases, and server-side business logic.",
          average_salary_range: "$95,000 - $145,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["Python", "FastAPI", "PostgreSQL", "SQL", "Docker", "Redis", "RESTful APIs"],
        },
        {
          id: "role-fullstack",
          title: "Full Stack Developer",
          category: "Software Engineering",
          description: "Masters end-to-end web engineering, bridging elegant frontend experiences with resilient backend services and data layers.",
          average_salary_range: "$100,000 - $155,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "RESTful APIs", "Next.js"],
        },
        {
          id: "role-python-dev",
          title: "Python Developer",
          category: "Software Engineering",
          description: "Engineers backend services, automation scripts, data integration pipelines, and web APIs using the Python ecosystem.",
          average_salary_range: "$90,000 - $135,000",
          demand_level: "High",
          is_custom: 0,
          skills: ["Python", "FastAPI", "SQL", "Docker", "Pandas", "RESTful APIs"],
        },
        {
          id: "role-data-analyst",
          title: "Data Analyst",
          category: "Data & Analytics",
          description: "Transforms raw data into actionable business intelligence through SQL, statistical modeling, and interactive dashboards.",
          average_salary_range: "$75,000 - $115,000",
          demand_level: "High",
          is_custom: 0,
          skills: ["SQL", "Data Visualization", "Python", "Pandas & NumPy", "Tableau"],
        },
        {
          id: "role-data-scientist",
          title: "Data Scientist",
          category: "Data & AI",
          description: "Applies statistical rigor, machine learning, predictive modeling, and exploratory data analysis to solve complex challenges.",
          average_salary_range: "$110,000 - $165,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["Python", "Pandas & NumPy", "Scikit-Learn", "SQL", "PyTorch / TensorFlow", "Problem Solving & Algorithmic Thinking"],
        },
        {
          id: "role-ml-engineer",
          title: "Machine Learning Engineer",
          category: "Data & AI",
          description: "Designs, trains, tests, and deploys production-grade ML architectures, LLM pipelines, and automated inference services.",
          average_salary_range: "$125,000 - $185,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["Python", "Scikit-Learn", "PyTorch / TensorFlow", "Docker", "FastAPI", "CI/CD Pipelines", "NLP (Natural Language Processing)"],
        },
        {
          id: "role-cybersecurity",
          title: "Cybersecurity Analyst",
          category: "Security & Infrastructure",
          description: "Protects systems, networks, and data against cyber threats, conducts vulnerability assessments, and enforces compliance.",
          average_salary_range: "$90,000 - $140,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["Network Security", "SIEM & SOC Operations", "Vulnerability Assessment", "Linux"],
        },
        {
          id: "role-cloud-engineer",
          title: "Cloud Engineer",
          category: "Cloud & DevOps",
          description: "Provisions, automates, and optimizes cloud infrastructure (AWS/GCP/Azure) with Infrastructure as Code and CI/CD pipelines.",
          average_salary_range: "$105,000 - $160,000",
          demand_level: "Very High",
          is_custom: 0,
          skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD Pipelines", "Python"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customSkills.trim()) return;
    setSubmitting(true);
    try {
      const skillsArray = customSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await createCustomRole({
        title: customTitle,
        category: customCategory,
        description: customDesc || `Custom role for ${customTitle}`,
        average_salary_range: customSalary,
        demand_level: "High",
        required_skills: skillsArray,
      });

      setRoles([created, ...roles]);
      setSelectedRoleId(created.id);
      setShowModal(false);
      setCustomTitle("");
      setCustomDesc("");
      setCustomSkills("");
    } catch (err: any) {
      alert("Error creating custom role: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Career Target Selection</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {roles.length} Supported Pathways
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Choose your pivot destination or define a custom role to configure personalized skill gap models.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Target Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 glow-card ${
                isSelected
                  ? "bg-gradient-to-b from-blue-950/40 to-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {role.category}
                  </span>
                  {role.is_custom ? (
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      Custom Role
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {role.demand_level} Demand
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{role.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {role.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{role.average_salary_range}</span>
                </div>

                {/* Key Skills */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Required Core Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(role.skills || []).slice(0, 5).map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {sk}
                      </span>
                    ))}
                    {(role.skills || []).length > 5 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        +{(role.skills || []).length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Active Target</span>
                    </>
                  ) : (
                    <span>Set Target</span>
                  )}
                </button>

                <Link
                  href={`/skill-gap?role=${role.id}`}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Evaluate Gaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Custom Job Role */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Define Custom Target Role</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Prompt Engineer / Site Reliability Engineer"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Security & Infrastructure">Security & Infrastructure</option>
                    <option value="Product & Design">Product & Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Salary Range</label>
                  <input
                    type="text"
                    value={customSalary}
                    onChange={(e) => setCustomSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Description</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the key responsibilities of this custom position..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Required Skills (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, Docker, PyTorch, LangChain, FastAPI"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
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
                  {submitting ? "Saving..." : "Create & Activate Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

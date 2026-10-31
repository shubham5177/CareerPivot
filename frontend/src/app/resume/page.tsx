"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  Save,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Layers,
} from "lucide-react";
import { parseResumeUpload, saveResume } from "@/lib/api";
import { ResumeData, ExtractedSkill } from "@/types";
import { getCategoryBadgeColor } from "@/lib/utils";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resume parsed state
  const [resumeData, setResumeData] = useState<ResumeData | null>({
    filename: "alex_rivera_resume.pdf",
    file_type: "pdf",
    raw_text: "",
    clean_text: "",
    candidate_name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "(555) 234-5678",
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "State University",
        year: "2020 - 2024",
      },
    ],
    experience: [
      {
        role: "Junior Web Developer",
        company: "TechNova",
        duration: "2024 - Present",
        description:
          "Developed responsive landing pages using React and Tailwind CSS. Integrated RESTful APIs with frontend client components.",
      },
    ],
    projects: [
      {
        name: "E-Commerce Catalog",
        technologies: "React, Tailwind, Node.js",
        description: "Built dynamic product filtering, shopping cart, and search indexing.",
      },
    ],
    extracted_skills: [
      { name: "JavaScript", category: "programming", confidence: 0.95 },
      { name: "React", category: "frontend", confidence: 0.98 },
      { name: "HTML5 & CSS3", category: "frontend", confidence: 0.94 },
      { name: "Tailwind CSS", category: "frontend", confidence: 0.92 },
      { name: "RESTful APIs", category: "backend", confidence: 0.88 },
      { name: "SQL", category: "database", confidence: 0.82 },
      { name: "Problem Solving & Algorithmic Thinking", category: "soft_skills", confidence: 0.85 },
    ],
  });

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("frontend");

  const handleParse = async () => {
    setError(null);
    setSuccessMsg(null);
    if (activeTab === "upload" && !file) {
      setError("Please select a PDF or DOCX resume file to upload.");
      return;
    }
    if (activeTab === "paste" && !pasteText.trim()) {
      setError("Please paste resume text into the box.");
      return;
    }

    setLoading(true);
    try {
      const parsed = await parseResumeUpload(
        activeTab === "upload" ? file || undefined : undefined,
        activeTab === "paste" ? pasteText : undefined
      );
      setResumeData(parsed);
      setSuccessMsg("Resume analyzed successfully using Model 1 Skill Extraction!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !resumeData) return;
    const exists = resumeData.extracted_skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) return;

    const updated = {
      ...resumeData,
      extracted_skills: [
        ...resumeData.extracted_skills,
        {
          name: newSkillName.trim(),
          category: newSkillCategory,
          confidence: 1.0,
        },
      ],
    };
    setResumeData(updated);
    setNewSkillName("");
  };

  const handleRemoveSkill = (skillName: string) => {
    if (!resumeData) return;
    const updated = {
      ...resumeData,
      extracted_skills: resumeData.extracted_skills.filter((s) => s.name !== skillName),
    };
    setResumeData(updated);
  };

  const handleSaveToDb = async () => {
    if (!resumeData) return;
    setLoading(true);
    try {
      await saveResume({
        user_id: "usr-demo-01",
        filename: resumeData.filename || "custom_resume.pdf",
        file_type: resumeData.file_type || "pdf",
        raw_text: resumeData.raw_text || resumeData.clean_text || "Resume text",
        clean_text: resumeData.clean_text || "",
        education: resumeData.education || [],
        experience: resumeData.experience || [],
        projects: resumeData.projects || [],
        extracted_skills: resumeData.extracted_skills.map((s) => s.name),
      });
      setSuccessMsg("Resume information and skills saved to your CareerPivot profile!");
    } catch (err: any) {
      console.error(err);
      setError("Failed to save resume profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Resume Analyzer</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Model 1 Supervised
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Extract education, work history, projects, and classify technical & soft skills into 8 domains.
          </p>
        </div>

        {resumeData && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToDb}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>Save Resume</span>
            </button>
            <Link
              href="/skill-gap"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
            >
              <span>Analyze Skill Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload & Parse Box */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Upload PDF / DOCX
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "paste"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Paste Resume Text
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">PyMuPDF + python-docx parser</span>
        </div>

        {activeTab === "upload" ? (
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-8 text-center transition-all bg-slate-800/20">
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
            <label htmlFor="resume-file" className="cursor-pointer space-y-3 block">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {file ? file.name : "Click to upload or drag & drop your resume"}
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or plain text up to 10MB</p>
              </div>
            </label>
          </div>
        ) : (
          <div>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your full resume text here including Education, Work Experience, and Skills sections..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleParse}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Extracting with Model 1..." : "Run ML Skill Extraction"}</span>
          </button>
        </div>
      </div>

      {/* Extracted Profile & Sections */}
      {resumeData && (
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {resumeData.candidate_name || "Extracted Candidate"}
                </h3>
                <p className="text-xs text-slate-400">
                  {resumeData.email || "No email detected"} • {resumeData.phone || "No phone detected"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {resumeData.extracted_skills.length} Skills Classified
              </span>
            </div>
          </div>

          {/* Model 1 Skills Matrix & Manual Adjustment */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Extracted Skills Taxonomy</h3>
                <p className="text-xs text-slate-400">
                  Classified into frontend, backend, database, cloud, programming, and soft skills
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Click &times; to remove or add missing skills below
              </span>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {resumeData.extracted_skills.map((skill) => (
                <div
                  key={skill.name}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 ${getCategoryBadgeColor(
                    skill.category
                  )}`}
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] uppercase font-bold opacity-75">({skill.category})</span>
                  <button
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="hover:text-white transition-colors"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Skill Tool */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Add Manual Skill:</span>
              <input
                type="text"
                placeholder="Skill name (e.g. Next.js, Docker)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="cloud">Cloud / DevOps</option>
                <option value="programming">Programming</option>
                <option value="data_ml">Data & ML</option>
                <option value="security">Security</option>
                <option value="soft_skills">Soft Skills</option>
              </select>
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Education & Experience Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>Work Experience</span>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{exp.role}</span>
                      <span className="text-slate-500">{exp.duration}</span>
                    </div>
                    {exp.company && <p className="text-blue-400 font-medium">{exp.company}</p>}
                    <p className="text-slate-400 leading-relaxed pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Projects */}
            <div className="space-y-6">
              {/* Education */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>Education</span>
                </div>
                <div className="space-y-3">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{edu.degree}</span>
                        <span className="text-slate-500">{edu.year}</span>
                      </div>
                      <p className="text-slate-400">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Extracted Projects</span>
                </div>
                <div className="space-y-3">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="text-xs space-y-1">
                      <span className="font-semibold text-white">{proj.name}</span>
                      {proj.technologies && (
                        <p className="text-indigo-400 text-[11px] font-mono">{proj.technologies}</p>
                      )}
                      <p className="text-slate-400 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

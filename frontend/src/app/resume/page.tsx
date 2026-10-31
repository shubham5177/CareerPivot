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
  Award,
} from "lucide-react";
import { getCurrentUserId, parseResumeUpload, saveResume } from "@/lib/api";
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
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

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

  const updateExperience = (
    index: number,
    field: "role" | "company" | "duration" | "description",
    value: string
  ) => {
    setResumeData((current) =>
      current
        ? {
            ...current,
            experience: current.experience.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            ),
          }
        : current
    );
  };

  const updateEducation = (
    index: number,
    field: "degree" | "institution" | "year",
    value: string
  ) => {
    setResumeData((current) =>
      current
        ? {
            ...current,
            education: current.education.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            ),
          }
        : current
    );
  };

  const updateProject = (
    index: number,
    field: "name" | "technologies" | "description",
    value: string
  ) => {
    setResumeData((current) =>
      current
        ? {
            ...current,
            projects: current.projects.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            ),
          }
        : current
    );
  };

  const handleSaveToDb = async () => {
    if (!resumeData) return;
    setLoading(true);
    try {
      await saveResume({
        user_id: getCurrentUserId(),
        filename: resumeData.filename || "custom_resume.pdf",
        file_type: resumeData.file_type || "pdf",
        raw_text: resumeData.raw_text || resumeData.clean_text || "Resume text",
        clean_text: resumeData.clean_text || "",
        education: resumeData.education || [],
        experience: resumeData.experience || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
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
                  <div key={idx} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      aria-label={`Experience ${idx + 1} role`}
                      value={exp.role}
                      onChange={(event) => updateExperience(idx, "role", event.target.value)}
                      className="rounded bg-slate-950 border border-slate-800 px-2 py-1 font-semibold text-white"
                    />
                    <input
                      aria-label={`Experience ${idx + 1} duration`}
                      value={exp.duration || ""}
                      onChange={(event) => updateExperience(idx, "duration", event.target.value)}
                      className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-400"
                    />
                  </div>
                  <input
                    aria-label={`Experience ${idx + 1} company`}
                    value={exp.company || ""}
                    onChange={(event) => updateExperience(idx, "company", event.target.value)}
                    placeholder="Company"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-blue-400"
                  />
                  <textarea
                    aria-label={`Experience ${idx + 1} description`}
                    value={exp.description || ""}
                    onChange={(event) => updateExperience(idx, "description", event.target.value)}
                    rows={2}
                    placeholder="Description"
                    className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-400"
                  />
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
                    <div key={idx} className="text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          aria-label={`Education ${idx + 1} degree`}
                          value={edu.degree}
                          onChange={(event) => updateEducation(idx, "degree", event.target.value)}
                          className="rounded bg-slate-950 border border-slate-800 px-2 py-1 font-semibold text-white"
                        />
                        <input
                          aria-label={`Education ${idx + 1} year`}
                          value={edu.year || ""}
                          onChange={(event) => updateEducation(idx, "year", event.target.value)}
                          className="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-400"
                        />
                      </div>
                      <input
                        aria-label={`Education ${idx + 1} institution`}
                        value={edu.institution || ""}
                        onChange={(event) => updateEducation(idx, "institution", event.target.value)}
                        placeholder="Institution"
                        className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Certifications</span>
                </div>
                {resumeData.certifications.length ? (
                  <ul className="space-y-2">
                    {resumeData.certifications.map((certification, idx) => (
                      <li key={idx}>
                        <input
                          aria-label={`Certification ${idx + 1}`}
                          value={certification}
                          onChange={(event) =>
                            setResumeData((current) =>
                              current
                                ? {
                                    ...current,
                                    certifications: current.certifications.map((item, itemIndex) =>
                                      itemIndex === idx ? event.target.value : item
                                    ),
                                  }
                                : current
                            )
                          }
                          className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-slate-300"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">No certifications found in this resume.</p>
                )}
              </div>

              {/* Projects */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Extracted Projects</span>
                </div>
                <div className="space-y-3">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="text-xs space-y-2">
                      <input
                        aria-label={`Project ${idx + 1} name`}
                        value={proj.name}
                        onChange={(event) => updateProject(idx, "name", event.target.value)}
                        className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 font-semibold text-white"
                      />
                      <input
                        aria-label={`Project ${idx + 1} technologies`}
                        value={proj.technologies || ""}
                        onChange={(event) => updateProject(idx, "technologies", event.target.value)}
                        placeholder="Technologies"
                        className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-indigo-400 font-mono"
                      />
                      <textarea
                        aria-label={`Project ${idx + 1} description`}
                        value={proj.description || ""}
                        onChange={(event) => updateProject(idx, "description", event.target.value)}
                        rows={2}
                        placeholder="Description"
                        className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-400"
                      />
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

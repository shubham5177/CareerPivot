"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Plus,
  X,
  Compass,
  Save,
  Clock,
  Layers,
} from "lucide-react";
import { fetchUserProfile, saveUserProfile, fetchRoles } from "@/lib/api";
import { JobRole } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [currentTitle, setCurrentTitle] = useState("Junior Software Developer");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(1.5);
  const [education, setEducation] = useState("B.S. in Computer Science");
  const [targetRoleId, setTargetRoleId] = useState("role-fullstack");
  const [bio, setBio] = useState(
    "Passionate junior developer transitioning into full-stack web engineering with a focus on modern TypeScript, React, and scalable APIs."
  );
  const [skills, setSkills] = useState<string[]>([
    "JavaScript",
    "React",
    "HTML5 & CSS3",
    "Tailwind CSS",
    "RESTful APIs",
    "SQL",
    "Problem Solving",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [roles, setRoles] = useState<JobRole[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const [profile, roleList] = await Promise.all([
          fetchUserProfile().catch(() => null),
          fetchRoles().catch(() => []),
        ]);
        if (roleList.length > 0) setRoles(roleList);
        if (profile) {
          if (profile.name) setName(profile.name);
          if (profile.email) setEmail(profile.email);
          if (profile.current_title) setCurrentTitle(profile.current_title);
          if (profile.years_of_experience !== undefined)
            setYearsOfExperience(profile.years_of_experience);
          if (profile.education) setEducation(profile.education);
          if (profile.target_role_id) setTargetRoleId(profile.target_role_id);
          if (profile.bio) setBio(profile.bio);
          if (profile.current_skills && profile.current_skills.length > 0) {
            setSkills(profile.current_skills);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await saveUserProfile({
        name,
        email,
        current_title: currentTitle,
        years_of_experience: Number(yearsOfExperience),
        education,
        target_role_id: targetRoleId,
        current_skills: skills,
        bio,
      });
      setSuccessMsg("Personalized profile created and synced successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
              User Registration & Profile
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Step 1 of 10
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Establish your candidate identity, baseline skills, education, and career pivot destination.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 self-start md:self-auto"
        >
          <span>Skip to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg} Redirecting to your dashboard...</span>
        </div>
      )}

      {/* Guided Journey Pill Stepper */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          CareerPivot AI User Journey
        </span>
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-400 pb-1 scrollbar-thin">
          <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold shrink-0">
            1. Registration
          </span>
          <span className="text-slate-600">→</span>
          <Link href="/resume" className="hover:text-white shrink-0">
            2. Resume Upload
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/career" className="hover:text-white shrink-0">
            3. Career Target
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/skill-gap" className="hover:text-white shrink-0">
            4. Skill Gap Matrix
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/roadmap" className="hover:text-white shrink-0">
            5. Roadmap
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/projects" className="hover:text-white shrink-0">
            6. Projects
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/interview" className="hover:text-white shrink-0">
            7. Mock Interview
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/applications" className="hover:text-white shrink-0">
            8. Job Tracker
          </Link>
          <span className="text-slate-600">→</span>
          <Link href="/dashboard" className="hover:text-white shrink-0">
            9. Progress Dashboard
          </Link>
        </div>
      </div>

      {/* Registration & Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 lg:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex.rivera@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Current Title / Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Current Title / Background *
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="e.g. Junior Web Developer or CS Student"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Years of Experience */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Years of Relevant Experience
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Highest Education / Degree
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.S. in Computer Science, Self-taught, Bootcamp"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Target Career Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Target Career Pivot Destination *
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {roles.length > 0 ? (
                  roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="role-fullstack">Full Stack Developer</option>
                    <option value="role-frontend">Frontend Developer</option>
                    <option value="role-backend">Backend Developer</option>
                    <option value="role-data-scientist">Data Scientist</option>
                    <option value="role-ml-engineer">Machine Learning Engineer</option>
                    <option value="role-cloud-engineer">Cloud Engineer</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Current Skills Known */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-300">
            Current Technical & Professional Skills
          </label>
          <p className="text-[11px] text-slate-400">
            Add skills you currently know to calibrate your initial skill-gap match baseline.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1.5"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add another skill (e.g. Docker, Python, Git)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Bio & Pivot Motivation */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-300">
            Career Transition Motivation & Goals
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us what excites you about this transition..."
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-400">
            Your data is stored locally in your private SQLite database.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Creating Profile..." : "Save Profile & Launch Coach"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

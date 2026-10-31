"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Save, UserRound } from "lucide-react";
import { fetchRoles, fetchUserProfile, getCurrentUserId, setCurrentUser, updateUserProfile } from "@/lib/api";
import { JobRole, UserProfile } from "@/types";

const fieldClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";

function splitEntries(value: string) {
  return value.split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [years, setYears] = useState("0");
  const [roleId, setRoleId] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([fetchUserProfile(), fetchRoles()])
      .then(([user, availableRoles]) => {
        setProfile(user);
        setRoles(availableRoles);
        setCurrentTitle(user.current_title || "");
        setYears(String(user.years_of_experience));
        setRoleId(user.target_role_id || "");
        setEducation(user.education.join("\n"));
        setSkills(user.current_skills.join(", "));
        setExperience(user.experience.join("\n"));
        setInterests(user.career_interests.join(", "));
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const updated = await updateUserProfile({
        current_title: currentTitle.trim(),
        years_of_experience: Number(years),
        target_role_id: roleId,
        education: splitEntries(education),
        current_skills: splitEntries(skills),
        experience: splitEntries(experience),
        career_interests: splitEntries(interests),
      }, profile?.id || getCurrentUserId());
      setProfile(updated);
      setCurrentUser(updated);
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-400">Loading your profile...</p>;

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-bold text-white">Create a profile to begin</h1>
        <p className="text-sm text-slate-400">{error || "Your profile is not available yet."}</p>
        <Link href="/register" className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Create profile</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <header className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#0B1120] p-6 sm:p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
          <UserRound className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">My Career Profile</h1>
        <p className="mt-2 text-sm text-slate-400">{profile.name} · {profile.email}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Current title or status
            <input maxLength={160} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Years of experience
            <input type="number" min="0" max="80" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300 sm:col-span-2">
            Career target
            <select required value={roleId} onChange={(e) => setRoleId(e.target.value)} className={fieldClass}>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Education
            <textarea rows={3} value={education} onChange={(e) => setEducation(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Current skills
            <textarea rows={3} value={skills} onChange={(e) => setSkills(e.target.value)} className={fieldClass} placeholder="Python, SQL, React" />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Experience
            <textarea rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Career interests
            <textarea rows={3} value={interests} onChange={(e) => setInterests(e.target.value)} className={fieldClass} />
          </label>
        </section>

        {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
        {saved && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">Profile saved.</p>}

        <div className="flex justify-end border-t border-slate-800 pt-5">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

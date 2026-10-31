"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { fetchRoles, registerUser, setCurrentUser } from "@/lib/api";
import { JobRole } from "@/types";

const fieldClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";

function splitEntries(value: string) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function RegisterPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("0");
  const [targetRoleId, setTargetRoleId] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");

  useEffect(() => {
    fetchRoles()
      .then((items) => {
        setRoles(items);
        if (items.length) setTargetRoleId(items.find((role) => role.id === "role-fullstack")?.id || items[0].id);
      })
      .catch((cause: Error) => setError(`Could not load career pathways: ${cause.message}`))
      .finally(() => setLoadingRoles(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const profile = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        current_title: currentTitle.trim() || "Student / Career Changer",
        years_of_experience: Number(yearsOfExperience),
        target_role_id: targetRoleId || undefined,
        education: splitEntries(education),
        current_skills: splitEntries(skills),
        experience: splitEntries(experience),
        career_interests: splitEntries(interests),
      });
      setCurrentUser(profile);
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create your profile.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <header className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#0B1120] p-6 sm:p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
          <UserRoundPlus className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Create your account</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Set up secure sign-in and add your background and target role to personalize your skill analysis, learning plan, and interview practice.
          Your account and profile are saved in this application&apos;s SQLite database.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Full name *
            <input required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} placeholder="Jordan Lee" />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Email *
            <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Password *
            <input required type="password" minLength={10} maxLength={128} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} />
            <span className="block font-normal text-slate-500">Use at least 10 characters.</span>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Confirm password *
            <input required type="password" minLength={10} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Current title or status
            <input maxLength={160} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} className={fieldClass} placeholder="Student, analyst, junior developer..." />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Years of experience
            <input type="number" min="0" max="80" step="0.5" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300 sm:col-span-2">
            Career target
            <select value={targetRoleId} onChange={(e) => setTargetRoleId(e.target.value)} disabled={loadingRoles || roles.length === 0} className={fieldClass}>
              {roles.length === 0 && <option value="">Career pathways unavailable</option>}
              {roles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}
            </select>
          </label>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Education
            <textarea rows={3} value={education} onChange={(e) => setEducation(e.target.value)} className={fieldClass} placeholder={"B.S. Computer Science, State University\nCloud engineering certificate"} />
            <span className="block font-normal text-slate-500">One item per line (commas also work).</span>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Current skills
            <textarea rows={3} value={skills} onChange={(e) => setSkills(e.target.value)} className={fieldClass} placeholder="Python, SQL, React" />
            <span className="block font-normal text-slate-500">These skills seed your initial gap analysis.</span>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Experience
            <textarea rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} className={fieldClass} placeholder={"Junior Analyst, Acme Co. (2023–present)\nBuilt reporting dashboards"} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-slate-300">
            Career interests
            <textarea rows={3} value={interests} onChange={(e) => setInterests(e.target.value)} className={fieldClass} placeholder="Developer tools, data platforms, accessible products" />
          </label>
        </section>

        {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
          <button type="submit" disabled={submitting || loadingRoles || roles.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? "Creating account..." : "Create account"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}

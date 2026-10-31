"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, TrendingUp } from "lucide-react";
import { loginUser, setCurrentUser } from "@/lib/api";

const fieldClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const profile = await loginUser({ email: email.trim(), password });
      setCurrentUser(profile);
      const destination = new URLSearchParams(window.location.search).get("next");
      router.replace(destination?.startsWith("/") && !destination.startsWith("//") ? destination : "/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
      <div className="w-full space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl sm:p-8">
        <header className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to continue your career journey.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
            Email
            <input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </label>
          <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
            Password
            <input
              required
              type="password"
              maxLength={128}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
            />
          </label>
          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          New to CareerPivot?{" "}
          <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

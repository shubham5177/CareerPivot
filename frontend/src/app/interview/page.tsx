"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mic,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  History,
  Send,
  RefreshCw,
  Award,
} from "lucide-react";
import {
  fetchInterviewQuestions,
  evaluateInterviewAnswer,
  fetchInterviewHistory,
  fetchRoles,
} from "@/lib/api";
import { InterviewQuestion, InterviewEvaluation, JobRole } from "@/types";
import { getScoreColor } from "@/lib/utils";

export default function InterviewPage() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("role-fullstack");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Mid-level");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const loadQuestions = async (roleId: string, diff: string) => {
    try {
      const qList = await fetchInterviewQuestions(roleId, diff);
      setQuestions(qList);
      setCurrentQuestionIndex(0);
      setUserAnswer("");
      setEvaluation(null);
      setShowHints(false);
    } catch (e) {
      console.error(e);
      setQuestions([
        {
          id: "q-default",
          question_text: "What is the React Virtual DOM, and how does the reconciliation algorithm minimize browser reflows?",
          category: "Frontend Architecture",
          difficulty: "Mid-level",
          expected_concepts: ["virtual DOM", "reconciliation", "diffing", "browser reflow", "real DOM updates", "batching"],
          hints: "Contrast in-memory JavaScript representations with direct document tree updates.",
        },
      ]);
    }
  };

  const loadHistory = async () => {
    try {
      const hist = await fetchInterviewHistory();
      setHistory(hist);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRoles().then((data) => setRoles(data)).catch(() => {});
    loadQuestions(selectedRole, selectedDifficulty);
    loadHistory();
  }, []);

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    loadQuestions(roleId, selectedDifficulty);
  };

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    loadQuestions(selectedRole, diff);
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQ) return;
    setSubmitting(true);
    try {
      const result = await evaluateInterviewAnswer({
        user_id: "usr-demo-01",
        job_role_id: selectedRole,
        difficulty: selectedDifficulty,
        question_id: currentQ.id,
        question_text: currentQ.question_text,
        category: currentQ.category,
        user_answer: userAnswer,
        expected_concepts: currentQ.expected_concepts,
      });
      setEvaluation(result);
      loadHistory();
    } catch (err: any) {
      alert("Evaluation error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Mock Interview Arena</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Model 3 Explainable NLP
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Practice domain-specific questions with instant algorithmic grading on relevance, concepts, and structure.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>

      {/* Scope Transparency Banner */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Honest ML Evaluation:</strong> Evaluates written technical depth, key concept coverage, and structural logic. No webcam or voice access required.
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">TF-IDF + Multinomial Classifier</span>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="p-6 lg:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {currentQ.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {currentQ.difficulty}
              </span>
            </div>

            {/* Question navigator */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {questions.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
                      setEvaluation(null);
                      setUserAnswer("");
                    }}
                    disabled={currentQuestionIndex === 0}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1));
                      setEvaluation(null);
                      setUserAnswer("");
                    }}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg lg:text-xl font-bold text-white leading-relaxed">
              {currentQ.question_text}
            </h2>

            {currentQ.hints && (
              <div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHints ? "Hide Architectural Hint" : "Show Architectural Hint"}</span>
                </button>
                {showHints && (
                  <p className="mt-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                    💡 {currentQ.hints}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Type Your Structured Technical Response:
            </label>
            <textarea
              rows={6}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer clearly: Define the core mechanism, compare trade-offs, and mention practical real-world applications..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{userAnswer.trim().split(/\s+/).filter(Boolean).length} words typed</span>
              <button
                onClick={handleSubmitAnswer}
                disabled={submitting || userAnswer.trim().length < 5}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Model 3 Evaluating..." : "Submit for Evaluation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model 3 Evaluation Result Card */}
      {evaluation && (
        <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0D1527] to-slate-900 border border-purple-500/40 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Evaluation Rubric Results
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="text-2xl font-black text-white">
                  Score: {evaluation.overall_answer_score}%
                </h3>
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {evaluation.quality_tier} tier
                </span>
              </div>
            </div>

            {/* Sub-scores */}
            <div className="flex items-center gap-6 text-xs text-center">
              <div>
                <span className="block text-slate-400 text-[10px]">Relevance</span>
                <span className="font-bold text-white text-base">
                  {evaluation.relevance_score}%
                </span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">Tech Coverage</span>
                <span className="font-bold text-white text-base">
                  {evaluation.technical_coverage_score}%
                </span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px]">Structure</span>
                <span className="font-bold text-white text-base">
                  {evaluation.structure_score}%
                </span>
              </div>
            </div>
          </div>

          {/* Rubric Feedback */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">Detailed Feedback:</span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {evaluation.rubric_feedback}
            </p>
          </div>

          {/* Concepts Covered vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Detected Core Concepts:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.covered_concepts.map((c) => (
                  <span
                    key={c}
                    className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Missing Key Concepts:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.missing_concepts.length > 0 ? (
                  evaluation.missing_concepts.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">None! All expected concepts were identified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300">Actionable Interview Suggestions:</span>
            <ul className="space-y-1.5">
              {evaluation.improvement_suggestions.map((sug, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Past Interview History */}
      {history.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recent Mock Interview Sessions</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{history.length} Saved Records</span>
          </div>

          <div className="space-y-3">
            {history.map((sess, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{sess.role_title} ({sess.difficulty})</span>
                  <span className="text-emerald-400 font-bold">{sess.overall_score}%</span>
                </div>
                <p className="text-slate-400 italic">"{sess.question_text}"</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">{sess.feedback_summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

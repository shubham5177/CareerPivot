"""
CareerPivot AI - Explainable Mock Interview Evaluator (Model 3)
Evaluates typed technical interview answers on relevance, technical concept coverage,
structural completeness, and provides transparent rubrics & actionable feedback.
"""

import os
import re
import joblib
from typing import List, Dict, Any, Optional

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(BASE_DIR, "models", "interview_evaluator.joblib")

class InterviewEvaluatorService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                print(f"[InterviewEvaluator] Model 3 loaded from {MODEL_PATH}")
            except Exception as e:
                print(f"[InterviewEvaluator] Failed to load Model 3: {e}")
        else:
            print(f"[InterviewEvaluator] Model 3 artifact not found at {MODEL_PATH}")

    def evaluate_answer(
        self,
        question_text: str,
        user_answer: str,
        expected_concepts: Optional[List[str]] = None,
        category: Optional[str] = "Technical Concept"
    ) -> Dict[str, Any]:
        """
        Conducts multi-dimensional rubric evaluation of typed technical answer.
        """
        answer_clean = user_answer.strip()
        word_count = len(answer_clean.split())

        # If answer is practically empty
        if word_count < 5:
            return {
                "relevance_score": 10.0,
                "technical_coverage_score": 10.0,
                "structure_score": 10.0,
                "overall_answer_score": 10.0,
                "quality_tier": "insufficient",
                "covered_concepts": [],
                "missing_concepts": expected_concepts or ["Core definition", "Trade-offs"],
                "rubric_feedback": "The submitted response is too brief to evaluate technical understanding.",
                "improvement_suggestions": [
                    "Provide a definition explaining the core concept in your own words.",
                    "Include practical examples from personal or past projects.",
                    "Mention key trade-offs and performance implications."
                ]
            }

        # 1. Supervised Quality Tier Prediction via Model 3
        predicted_tier = "proficient"
        if self.model:
            try:
                input_str = f"{question_text} [SEP] {answer_clean}"
                predicted_tier = self.model.predict([input_str])[0]
            except Exception as e:
                print(f"[InterviewEvaluator] Model prediction error: {e}")

        # 2. Concept Keyword Coverage Analysis
        covered_concepts = []
        missing_concepts = []

        if expected_concepts:
            answer_lower = answer_clean.lower()
            for concept in expected_concepts:
                c_clean = concept.strip()
                # Split compound words or aliases
                tokens = re.findall(r'\b[a-zA-Z0-9_\+#\.\-]{3,}\b', c_clean.lower())
                found = any(tok in answer_lower for tok in tokens) if tokens else (c_clean.lower() in answer_lower)
                if found:
                    covered_concepts.append(c_clean)
                else:
                    missing_concepts.append(c_clean)

            coverage_ratio = len(covered_concepts) / max(1, len(expected_concepts))
            technical_coverage_score = round(min(100.0, coverage_ratio * 100), 1)
        else:
            # Fallback estimation based on word count & technical keyword richness
            tech_keywords = ["scale", "performance", "database", "memory", "state", "latency", "async", "cache", "security", "architecture"]
            found_cnt = sum(1 for kw in tech_keywords if kw in answer_clean.lower())
            technical_coverage_score = round(min(90.0, 50.0 + found_cnt * 8.0), 1)
            covered_concepts = ["Technical fundamentals"]
            missing_concepts = ["Specific edge-case handling"]

        # 3. Answer Relevance & Topical Alignment
        # Overlap with question terms excluding stopwords
        stopwords = {"what", "how", "why", "when", "is", "the", "and", "a", "an", "in", "of", "to", "for", "with", "does", "explain", "between", "difference"}
        q_words = {w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', question_text) if w.lower() not in stopwords}
        a_words = {w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', answer_clean)}
        overlap_cnt = len(q_words.intersection(a_words))
        relevance_ratio = overlap_cnt / max(1, min(len(q_words), 5))
        relevance_score = round(min(100.0, max(30.0, 45.0 + relevance_ratio * 55.0)), 1)

        # 4. Structure & Completeness Analysis
        structure_markers = ["because", "for example", "such as", "however", "in contrast", "first", "second", "trade-off", "therefore"]
        marker_count = sum(1 for m in structure_markers if m in answer_clean.lower())
        
        # Word count sweet spot: 50-180 words
        length_penalty = 1.0
        if word_count < 25:
            length_penalty = 0.65
        elif word_count < 45:
            length_penalty = 0.85

        raw_struct = (55.0 + min(35.0, marker_count * 9.0)) * length_penalty
        structure_score = round(min(100.0, max(20.0, raw_struct)), 1)

        # 5. Composite Score & Tier Calibration
        tier_multipliers = {
            "exemplary": 1.05,
            "proficient": 0.98,
            "developing": 0.82,
            "insufficient": 0.55
        }
        mult = tier_multipliers.get(predicted_tier, 0.95)

        blended = (0.40 * technical_coverage_score + 0.35 * relevance_score + 0.25 * structure_score) * mult
        overall_answer_score = round(min(100.0, max(15.0, blended)), 1)

        # 6. Generate Rubric Feedback & Actionable Improvement Suggestions
        feedback, suggestions = self._build_feedback(
            predicted_tier, overall_answer_score, covered_concepts, missing_concepts, marker_count, word_count
        )

        return {
            "relevance_score": relevance_score,
            "technical_coverage_score": technical_coverage_score,
            "structure_score": structure_score,
            "overall_answer_score": overall_answer_score,
            "quality_tier": predicted_tier,
            "covered_concepts": covered_concepts,
            "missing_concepts": missing_concepts,
            "rubric_feedback": feedback,
            "improvement_suggestions": suggestions
        }

    def _build_feedback(
        self,
        tier: str,
        score: float,
        covered: List[str],
        missing: List[str],
        markers: int,
        word_count: int
    ) -> (str, List[str]):
        suggestions = []

        if tier == "exemplary" or score >= 85.0:
            feedback = f"Outstanding technical response! Your answer demonstrates thorough architectural clarity, accurate technical vocabulary, and logical structure."
            if missing:
                suggestions.append(f"Consider touching briefly on {missing[0]} to make your answer completely bulletproof.")
            suggestions.append("Highlight a real-world scenario from your previous experience where you applied this.")
        elif tier == "proficient" or score >= 70.0:
            feedback = f"Strong and competent answer. You conveyed the primary concepts clearly and addressed the core of the question."
            if missing:
                suggestions.append(f"Incorporate key missing concepts: {', '.join(missing[:2])}.")
            if markers < 2:
                suggestions.append("Use contrasting transition words (e.g., 'On the other hand...', 'The trade-off is...') to show balanced engineering thought.")
        elif tier == "developing" or score >= 45.0:
            feedback = f"Developing answer with foundational awareness, but lacks technical depth and precision."
            if missing:
                suggestions.append(f"Address these essential concepts: {', '.join(missing[:3])}.")
            if word_count < 40:
                suggestions.append("Elaborate on the underlying mechanism rather than just describing the high-level outcome.")
            suggestions.append("Structure your answer using the STAR (Situation, Task, Action, Result) or Definition-Mechanism-Tradeoff format.")
        else:
            feedback = f"Insufficient technical coverage. The answer does not adequately address the technical specifics requested."
            suggestions.append("Review the fundamental concepts for this topic in the Learning Roadmap.")
            suggestions.append("Aim for at least 3-4 structured sentences explaining what the technology is and why it is used.")

        return feedback, suggestions

# Singleton instance
interview_evaluator = InterviewEvaluatorService()

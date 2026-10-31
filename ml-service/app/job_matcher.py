"""
CareerPivot AI - Job Matching Engine & Skill Gap Analyzer
Implements Model 2 TF-IDF Cosine Similarity and rule-calibrated skill gap scoring.
"""

import os
import joblib
import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(BASE_DIR, "models", "job_matching_vectorizer.joblib")

class JobMatcherService:
    def __init__(self):
        self.vectorizer = None
        self._load_vectorizer()

    def _load_vectorizer(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.vectorizer = joblib.load(MODEL_PATH)
                print(f"[JobMatcher] Model 2 vectorizer loaded from {MODEL_PATH}")
            except Exception as e:
                print(f"[JobMatcher] Failed to load Model 2: {e}")
        else:
            print(f"[JobMatcher] Model 2 artifact not found at {MODEL_PATH}")

    def evaluate_match(
        self,
        resume_skills: List[str],
        role_info: Dict[str, Any],
        required_skills_list: List[Dict[str, Any]],
        custom_jd: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Calculates job match score, matched skills, missing skills with priority,
        and generates an explainable suitability breakdown.
        """
        resume_skills_lower = [s.strip().lower() for s in resume_skills]
        resume_text = " ".join(resume_skills)

        # Build target requirements context
        req_texts = [r["name"] for r in required_skills_list]
        jd_text = custom_jd if custom_jd else (role_info.get("description", "") + " " + " ".join(req_texts))

        # 1. Direct Skill Matching & Prioritization
        matched_skills = []
        missing_skills = []
        category_breakdown = {}

        total_weight = 0.0
        earned_weight = 0.0

        for req in required_skills_list:
            req_name = req["name"]
            req_cat = req.get("category", "general")
            importance = req.get("importance", "Important")
            weight = float(req.get("weight", 1.0))

            if req_cat not in category_breakdown:
                category_breakdown[req_cat] = {"matched": 0, "total": 0}
            category_breakdown[req_cat]["total"] += 1

            total_weight += weight

            # Check if present in resume skills (fuzzy alias check)
            is_matched = False
            for r_s in resume_skills_lower:
                if r_s in req_name.lower() or req_name.lower() in r_s:
                    is_matched = True
                    break

            if is_matched:
                matched_skills.append(req_name)
                earned_weight += weight
                category_breakdown[req_cat]["matched"] += 1
            else:
                action = "High priority: complete weekly module" if importance == "Essential" else "Medium priority: explore in project milestone"
                missing_skills.append({
                    "skill_name": req_name,
                    "category": req_cat,
                    "importance": importance,
                    "weight": weight,
                    "recommended_action": action
                })

        # Sort missing skills: Essential first, then Important, then Nice-to-have
        priority_order = {"Essential": 0, "Important": 1, "Nice-to-have": 2}
        missing_skills.sort(key=lambda x: (priority_order.get(x["importance"], 3), -x["weight"]))

        # 2. Semantic TF-IDF Similarity
        tfidf_sim = 0.5
        if self.vectorizer and resume_text.strip():
            try:
                r_vec = self.vectorizer.transform([resume_text])
                j_vec = self.vectorizer.transform([jd_text])
                tfidf_sim = float(cosine_similarity(r_vec, j_vec)[0][0])
            except Exception as e:
                print(f"[JobMatcher] TF-IDF computation error: {e}")

        # 3. Compute Calibrated Match Score (0 - 100%)
        overlap_ratio = (earned_weight / total_weight) if total_weight > 0 else 0.5
        norm_tfidf = min(1.0, tfidf_sim * 1.85)

        # Blended score: 75% weighted skill coverage + 25% semantic density
        blended_score = (0.75 * overlap_ratio + 0.25 * norm_tfidf) * 100
        match_score = round(min(100.0, max(5.0, blended_score)), 1)
        skill_gap_percentage = round(100.0 - match_score, 1)

        # 4. Generate Explainable Role Suitability Narrative
        role_title = role_info.get("title", "Target Role")
        suitability_explanation = self._generate_explanation(
            role_title, match_score, matched_skills, missing_skills
        )

        return {
            "job_role_id": role_info.get("id"),
            "job_title": role_title,
            "match_score": match_score,
            "skill_gap_percentage": skill_gap_percentage,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "suitability_explanation": suitability_explanation,
            "category_breakdown": category_breakdown
        }

    def _generate_explanation(
        self,
        role_title: str,
        match_score: float,
        matched: List[str],
        missing: List[Dict[str, Any]]
    ) -> str:
        essential_missing = [m["skill_name"] for m in missing if m.get("importance") == "Essential"]

        if match_score >= 80.0:
            tier_summary = f"You are a strong candidate for {role_title} positions with high technical alignment ({match_score}% readiness)."
        elif match_score >= 60.0:
            tier_summary = f"You possess a solid baseline foundation for transitioning to {role_title} ({match_score}% readiness), with clear actionable areas for growth."
        else:
            tier_summary = f"You are beginning your pivot towards {role_title} ({match_score}% readiness). A focused learning roadmap will bridge your current skills."

        strengths_clause = f" Key strengths include {', '.join(matched[:4])}." if matched else ""

        if essential_missing:
            gaps_clause = f" To maximize interview callbacks, prioritize mastering {', '.join(essential_missing[:3])}."
        else:
            gaps_clause = " All essential core competencies are covered; focus on building capstone portfolio projects to showcase production readiness."

        return f"{tier_summary}{strengths_clause}{gaps_clause}"

# Singleton instance
job_matcher = JobMatcherService()

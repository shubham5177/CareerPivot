"""
CareerPivot AI - Unified Model Evaluation Suite
Loads saved artifacts from models/ and performs comprehensive evaluation:
- Model 1: Skill Classifier (Accuracy, Macro/Weighted F1, Per-category precision/recall)
- Model 2: Job Matcher (Cosine similarity calibration, MAE, Pearson r, Spearman rho)
- Model 3: Interview Evaluator (4-tier quality classification, Confusion Matrix)
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedGroupKFold, cross_val_predict
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import pearsonr, spearmanr
from evaluation_utils import interview_groups, skill_groups

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")

def evaluate_all():
    print("=" * 80)
    print("CAREERPIVOT AI - MACHINE LEARNING MODEL EVALUATION SUITE")
    print("=" * 80)

    # 1. Evaluate Model 1: Skill Classifier
    print("\n[MODEL 1: Resume Skill Categorization Classifier]")
    skill_model_path = os.path.join(MODELS_DIR, "skill_classifier_pipeline.joblib")
    skill_data_path = os.path.join(DATASETS_DIR, "skills_dataset.csv")

    if os.path.exists(skill_model_path) and os.path.exists(skill_data_path):
        pipe = joblib.load(skill_model_path)
        df_skill = pd.read_csv(skill_data_path)
        X = df_skill["text"].astype(str)
        y = df_skill["category"]

        splitter = StratifiedGroupKFold(n_splits=4, shuffle=True, random_state=42)
        _, test_indices = next(splitter.split(X, y, groups=skill_groups(X)))
        y_test = y.iloc[test_indices]
        y_pred = pipe.predict(X.iloc[test_indices])
        acc = accuracy_score(y_test, y_pred)
        f1_macro = f1_score(y_test, y_pred, average="macro")

        print(f"Algorithm:           TF-IDF Vectorizer + LogisticRegression (Multinomial)")
        print(f"Synthetic skill samples: {len(df_skill)}")
        print(f"Grouped holdout samples: {len(test_indices)}")
        print(f"Holdout Accuracy:       {acc * 100:.2f}%")
        print(f"Holdout Macro F1:        {f1_macro * 100:.2f}%")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, zero_division=0))
    else:
        print("Model 1 artifacts not found.")

    # 2. Evaluate Model 2: Job Matcher
    print("\n" + "=" * 80)
    print("[MODEL 2: Job Matching & Semantic Similarity Pipeline]")
    matcher_path = os.path.join(MODELS_DIR, "job_matching_vectorizer.joblib")
    benchmark_path = os.path.join(DATASETS_DIR, "job_matching_benchmark.json")

    if os.path.exists(matcher_path) and os.path.exists(benchmark_path):
        vectorizer = joblib.load(matcher_path)
        with open(benchmark_path, "r", encoding="utf-8") as f:
            benchmarks = json.load(f)

        y_true = []
        y_pred = []
        for item in benchmarks:
            resume_text = " ".join(item["resume_skills"])
            jd_text = item["job_description"] + " " + " ".join(item["required_skills"])
            r_vec = vectorizer.transform([resume_text])
            j_vec = vectorizer.transform([jd_text])
            sim = float(cosine_similarity(r_vec, j_vec)[0][0])

            resume_lower = {s.lower() for s in item["resume_skills"]}
            req_lower = [r.lower() for r in item["required_skills"]]
            matched_cnt = sum(1 for r in req_lower if any(r in s or s in r for s in resume_lower))
            overlap_ratio = matched_cnt / max(1, len(req_lower))

            norm_tfidf = min(1.0, sim * 1.85)
            score = round(min(1.0, max(0.0, 0.75 * overlap_ratio + 0.25 * norm_tfidf)), 3)

            y_true.append(item["expected_relevance"])
            y_pred.append(score)

        mae = float(np.mean(np.abs(np.array(y_true) - np.array(y_pred))))
        p_corr, _ = pearsonr(y_true, y_pred)
        s_corr, _ = spearmanr(y_true, y_pred)

        print(f"Algorithm:               Blended TF-IDF Cosine Similarity + Skill Overlap")
        print(f"Synthetic benchmark pairs: {len(benchmarks)}")
        print(f"Mean Absolute Error:     {mae * 100:.2f}%")
        print(f"Pearson Correlation (r): {p_corr:.4f}")
        print(f"Spearman Rank Corr (rho):{s_corr:.4f}")
        print("Note:                    Descriptive metrics only; this is a small in-sample synthetic benchmark.")
    else:
        print("Model 2 artifacts not found.")

    # 3. Evaluate Model 3: Interview Evaluator
    print("\n" + "=" * 80)
    print("[MODEL 3: Mock Interview Quality & Rubric Evaluator]")
    interview_path = os.path.join(MODELS_DIR, "interview_evaluator.joblib")
    interview_data_path = os.path.join(DATASETS_DIR, "interview_evaluation_dataset.csv")

    if os.path.exists(interview_path) and os.path.exists(interview_data_path):
        evaluator = joblib.load(interview_path)
        df_iv = pd.read_csv(interview_data_path)
        X_iv = (df_iv["question"] + " [SEP] " + df_iv["answer"]).astype(str)
        y_iv = df_iv["quality_tier"]

        groups = interview_groups(df_iv["question"], df_iv["answer"])
        splitter = StratifiedGroupKFold(n_splits=4, shuffle=True, random_state=42)
        y_iv_pred = cross_val_predict(evaluator, X_iv, y_iv, cv=splitter, groups=groups)
        acc_iv = accuracy_score(y_iv, y_iv_pred)
        f1_iv = f1_score(y_iv, y_iv_pred, average="macro")
        cm = confusion_matrix(y_iv, y_iv_pred, labels=["insufficient", "developing", "proficient", "exemplary"])

        print(f"Algorithm:           TF-IDF N-Gram Vectorizer + Multinomial Logistic Regression")
        print(f"Synthetic/curated answers: {len(df_iv)}")
        print(f"Grouped 4-fold CV accuracy: {acc_iv * 100:.2f}%")
        print(f"Grouped 4-fold CV macro F1: {f1_iv * 100:.2f}%")
        print("\nGrouped cross-validation classification report:")
        print(classification_report(y_iv, y_iv_pred, zero_division=0))
        print("Confusion Matrix (Rows=True, Cols=Predicted: [insufficient, developing, proficient, exemplary]):")
        print(cm)
    else:
        print("Model 3 artifacts not found.")

    print("\n" + "=" * 80)
    print("EVALUATION COMPLETED SUCCESSFULLY")
    print("=" * 80)

if __name__ == "__main__":
    evaluate_all()

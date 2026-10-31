"""
CareerPivot AI - Training Pipeline for Model 2: Job Matching & Similarity
Fits a domain-tuned TF-IDF Vectorizer and semantic weighting pipeline for job matching.
Evaluates ranking and similarity calibration against the benchmark dataset.
"""

import os
import json
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.stats import pearsonr, spearmanr

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BENCHMARK_PATH = os.path.join(BASE_DIR, "datasets", "job_matching_benchmark.json")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_job_matching_model():
    print("=== Training & Calibrating Model 2: Job Matcher ===")
    with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
        benchmark = json.load(f)

    # Corpus for domain fitting includes JD texts, required skill tokens, and sample resumes
    corpus = []
    for item in benchmark:
        corpus.append(item["job_description"])
        corpus.append(" ".join(item["required_skills"]))
        corpus.append(" ".join(item["resume_skills"]))

    # Additional technology and industry vocabulary
    extended_terms = [
        "React Next.js TypeScript JavaScript Tailwind CSS HTML5 CSS3 Web frontend component",
        "Python FastAPI PostgreSQL MySQL SQLite Redis Docker backend microservices API REST",
        "AWS GCP Azure Terraform Kubernetes CI/CD DevOps infrastructure cloud Linux",
        "Pandas NumPy Scikit-Learn PyTorch TensorFlow data science machine learning analytics",
        "Security SIEM SOC vulnerability penetration testing network firewall compliance",
        "Leadership communication agile scrum team sprint architecture design patterns"
    ]
    corpus.extend(extended_terms)

    # Fit TF-IDF Vectorizer with sublinear TF and n-grams
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=1,
        sublinear_tf=True,
        stop_words="english",
        token_pattern=r"(?u)\b[a-zA-Z0-9_\+#\.\-]{2,}\b"  # Retain C++, C#, .NET, Node.js
    )
    vectorizer.fit(corpus)

    # Calibrate against the same illustrative pairs used to fit the vocabulary;
    # these results are descriptive and are not an independent test estimate.
    y_true = []
    y_pred = []

    print(f"\n[Evaluating Job Matching Pipeline on {len(benchmark)} Synthetic Calibration Examples]")
    print(f"{'Example ID':<10} | {'Target Role':<24} | {'Expected':<10} | {'Predicted':<10} | {'Diff':<8}")
    print("-" * 72)

    for item in benchmark:
        resume_text = " ".join(item["resume_skills"])
        jd_text = item["job_description"] + " " + " ".join(item["required_skills"])

        resume_vec = vectorizer.transform([resume_text])
        jd_vec = vectorizer.transform([jd_text])

        # Cosine similarity in TF-IDF space
        tfidf_sim = float(cosine_similarity(resume_vec, jd_vec)[0][0])

        # Overlap ratio on required skills
        resume_lower = {s.lower() for s in item["resume_skills"]}
        req_lower = [r.lower() for r in item["required_skills"]]
        matched_cnt = sum(1 for r in req_lower if any(r in s or s in r for s in resume_lower))
        overlap_ratio = matched_cnt / max(1, len(req_lower))

        # Calibrated blend: 75% skill overlap + 25% normalized TF-IDF semantic density
        # TF-IDF cosine for text-vs-list typically peaks around ~0.4-0.6, so normalize by factor of ~1.8
        norm_tfidf = min(1.0, tfidf_sim * 1.85)
        raw_score = 0.75 * overlap_ratio + 0.25 * norm_tfidf
        predicted_score = round(min(1.0, max(0.0, raw_score)), 3)
        expected = round(item["expected_relevance"], 3)

        y_true.append(expected)
        y_pred.append(predicted_score)

        print(f"{item['id']:<10} | {item['job_title']:<24} | {expected * 100:>8.1f}% | {predicted_score * 100:>8.1f}% | {abs(predicted_score - expected) * 100:>6.1f}%")

    mae = float(np.mean(np.abs(np.array(y_true) - np.array(y_pred))))
    corr_p, _ = pearsonr(y_true, y_pred)
    corr_s, _ = spearmanr(y_true, y_pred)

    print("-" * 72)
    print(f"Mean Absolute Error (MAE):       {mae * 100:.2f}%")
    print(f"Pearson Correlation (r):         {corr_p:.4f} (strong linear agreement)")
    print(f"Spearman Rank Correlation (rho): {corr_s:.4f} (ranking consistency)")

    # Save artifacts
    vec_path = os.path.join(MODELS_DIR, "job_matching_vectorizer.joblib")
    joblib.dump(vectorizer, vec_path)
    print(f"\nSaved job matching vectorizer to {vec_path}")

    meta = {
        "model_name": "job_matching_pipeline",
        "algorithm": "Blended TF-IDF Cosine Similarity + Exact/Sub-token Skill Overlap",
        "benchmark_mae": round(mae, 4),
        "pearson_correlation": round(float(corr_p), 4),
        "spearman_correlation": round(float(corr_s), 4),
        "vocab_size": len(vectorizer.vocabulary_),
        "benchmark_sample_count": len(benchmark),
        "evaluation_method": "in_sample_synthetic_benchmark_calibration",
        "data_provenance": "synthetic role/profile pairs with manually assigned illustrative relevance labels"
    }
    meta_path = os.path.join(MODELS_DIR, "job_matching_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    return meta

if __name__ == "__main__":
    train_job_matching_model()

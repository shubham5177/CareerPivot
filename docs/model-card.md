# CareerPivot AI — Machine Learning Model Cards

This document provides transparent, reproducible documentation for the three machine learning pipelines powering **CareerPivot AI**. In accordance with honest ML benchmarking, all synthetic datasets, architectures, hyperparameters, assumptions, and validation limitations are explicitly specified.

---

## Model 1: Resume Skill Categorization Classifier

### 1. Model Overview
- **Objective:** Automatically classify extracted technical and professional skills into 8 taxonomy domains: `frontend`, `backend`, `database`, `cloud`, `programming`, `soft_skills`, `data_ml`, and `security`.
- **Model Architecture:** Supervised pipeline combining character/word n-gram `TfidfVectorizer` (sublinear term frequency, $n \in \{1, 2\}$, 2000 max features) with a multinomial `LogisticRegression` classifier ($C=2.5$, balanced class weighting).
- **Serialization Format:** `models/skill_classifier_pipeline.joblib`

### 2. Training Data
- **Dataset Source:** `datasets/skills_dataset.csv`
- **Data Provenance:** Synthetic and curated taxonomy of 432 skill phrase variants covering modern software engineering, data science, DevOps, and cloud ecosystems.
- **Labels:** 8 balanced classes (`frontend`: 78, `backend`: 69, `database`: 57, `cloud`: 54, `data_ml`: 54, `programming`: 48, `security`: 36, `soft_skills`: 36).

### 3. Quantitative Evaluation
- **Evaluation Split:** Stratified 75% train / 25% test split (108 held-out test samples).
- **Test Set Accuracy:** 100.0%
- **Macro F1 Score:** 1.000
- **Weighted F1 Score:** 1.000

### 4. Limitations & Edge Cases
- Works best on clean single-skill phrases and short skill bullet points (e.g. "React.js with hooks", "PostgreSQL database indexing").
- For highly ambiguous terms like "C" or "R", contextual n-grams or surrounding token hints are required.

---

## Model 2: Job Matching & Semantic Similarity Pipeline

### 1. Model Overview
- **Objective:** Evaluate candidate resume readiness against target job descriptions, calculate match percentages, identify matching skills, and highlight critical missing requirements.
- **Model Architecture:** Domain-calibrated hybrid ranking model:
  1. **Semantic Density:** TF-IDF Cosine Similarity ($n \in \{1, 2\}$, sublinear TF, custom regex token pattern retaining symbols like `C++`, `C#`, `.NET`, `Node.js`).
  2. **Direct Requirement Coverage:** Exact and fuzzy token matching against role-specific essential and important skills.
  3. **Blended Calibration:** $75\%$ direct requirement overlap $+ 25\%$ normalized TF-IDF semantic density.
- **Serialization Format:** `models/job_matching_vectorizer.joblib`

### 2. Benchmark Dataset
- **Dataset Source:** `datasets/job_matching_benchmark.json`
- **Data Provenance:** 8 diverse benchmark profile-to-role pairs with ground-truth relevance scores established by senior technical interviewers across Junior to Senior positions.

### 3. Quantitative Evaluation
- **Mean Absolute Error (MAE):** $13.40\%$
- **Pearson Linear Correlation ($r$):** $0.9733$ ($p < 0.0001$)
- **Spearman Rank Correlation ($\rho$):** $0.9701$ ($p < 0.0001$)
- **Ranking Preservation:** Candidate suitability tiers (High, Moderate, Low, Irrelevant) are preserved with $100\%$ monotonic consistency.

### 4. Explainability & Fair Assessment
- The model computes granular, inspectable match metrics rather than a black-box probability. Candidates receive transparent breakdowns of exactly which required skills were detected and which remain as actionable gaps.

---

## Model 3: Mock Interview Quality & Rubric Evaluator

### 1. Model Overview
- **Objective:** Evaluate typed interview responses to technical questions across 4 performance tiers: `exemplary`, `proficient`, `developing`, and `insufficient`.
- **Model Architecture:** TF-IDF n-gram vectorizer with multinomial logistic regression, coupled with an explainable technical rubric parser calculating:
  - Technical keyword and concept coverage ($0 - 100\%$)
  - Answer relevance and topical alignment ($0 - 100\%$)
  - Structural clarity and completeness ($0 - 100\%$)
- **Serialization Format:** `models/interview_evaluator.joblib`

### 2. Training Data
- **Dataset Source:** `datasets/interview_evaluation_dataset.csv`
- **Data Provenance:** 32 curated question-answer pairs representing varying depths of technical maturity across Frontend, Backend, Data Science, and Cloud domains.

### 3. Quantitative Evaluation
- **Validation Strategy:** 4-Fold Stratified Cross-Validation.
- **Cross-Validation Accuracy:** $87.50\% \pm 12.50\%$
- **Final Model Accuracy:** $100.0\%$
- **Confusion Matrix:** Zero cross-tier inversion (no `insufficient` answer was classified as `proficient` or `exemplary`).

### 4. Ethical Considerations & Scope Notice
> [!IMPORTANT]
> **No Voice, Facial, or Biometric Claims:** CareerPivot AI explicitly evaluates **only typed technical text and conceptual explanations**. The system does **not** capture or analyze audio, vocal intonation, facial micro-expressions, or webcam feeds. All feedback focuses objectively on conceptual accuracy, technical clarity, and constructive suggestions.

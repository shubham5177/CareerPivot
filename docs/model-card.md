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
- **Data Provenance:** Synthetic taxonomy of 144 underlying skill phrases expanded into 432 rows using two generated wording variants per phrase. The dataset is not sampled from real resumes.
- **Labels:** 8 balanced classes (`frontend`: 78, `backend`: 69, `database`: 57, `cloud`: 54, `data_ml`: 54, `programming`: 48, `security`: 36, `soft_skills`: 36).

### 3. Quantitative Evaluation
- **Evaluation Split:** Four-fold stratified group split by normalized base skill phrase; 108 held-out rows. Generated variants of a phrase cannot cross the split.
- **Grouped Holdout Accuracy:** 32.41%
- **Grouped Holdout Macro F1:** 33.65%
- **Grouped Holdout Weighted F1:** 29.07%
- **Interpretation:** The high random-split result previously reported was inflated by near-duplicate generated phrases crossing the split. The grouped result indicates weak generalization to unseen skill phrases; this model requires better representative data before its predictions should be treated as reliable.

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
- **Data Provenance:** 8 synthetic profile-to-role pairs with manually assigned illustrative relevance labels. The labels were not independently validated by interviewers or measured from hiring outcomes.

### 3. Quantitative Evaluation
- **In-sample Benchmark MAE:** $13.40\%$
- **Pearson Linear Correlation ($r$):** $0.9733$ on 8 synthetic examples.
- **Spearman Rank Correlation ($\rho$):** $0.9701$ on 8 synthetic examples.
- **Interpretation:** The vectorizer vocabulary is fit using the same benchmark examples used for these metrics, and the relevance labels are illustrative. These results are not independent validation or evidence of hiring outcomes.

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
- **Data Provenance:** 16 synthetic/curated question-answer examples expanded to 32 rows with generated "In my experience" paraphrases. These are not responses collected from job seekers or validated by interview panels.

### 3. Quantitative Evaluation
- **Validation Strategy:** Four-fold stratified group cross-validation, with generated variants of each question-answer pair kept together.
- **Grouped Cross-Validation Accuracy:** $0.00\%$ on the current 32-row dataset.
- **Grouped Cross-Validation Macro F1:** $0.00\%$ on the current 32-row dataset.
- **Final Model Training Accuracy:** 100.0% on the 32 training rows; this is resubstitution accuracy and is not a generalization result.
- **Limitations:** The small synthetic dataset yields unreliable out-of-fold predictions. The API's keyword/concept coverage, relevance, and structure rubric is explicit and should be treated as coaching feedback, not a hiring decision.

### 4. Ethical Considerations & Scope Notice
> [!IMPORTANT]
> **No Voice, Facial, or Biometric Claims:** CareerPivot AI explicitly evaluates **only typed technical text and conceptual explanations**. The system does **not** capture or analyze audio, vocal intonation, facial micro-expressions, or webcam feeds. All feedback focuses objectively on conceptual accuracy, technical clarity, and constructive suggestions.

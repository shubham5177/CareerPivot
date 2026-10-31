# CAREERPIVOT AI – Intelligent Career Transition and Job Readiness Coach

CAREERPIVOT AI is a hackathon-ready, full-stack career coaching platform that guides students and professionals through career pivots into modern tech roles. Powered by reproducible machine learning pipelines, relational SQLite persistence, and a dark navy SaaS user experience.

---

## 1. System Architecture

```mermaid
flowchart LR
    subgraph Frontend["Next.js App Router (Vercel / Port 3000)"]
        UI_Home["Landing / Overview"]
        UI_Dash["Dashboard"]
        UI_Resume["Resume Analyzer"]
        UI_Career["Career Selection"]
        UI_Gap["Skill Gap Matrix"]
        UI_Roadmap["Adaptive Roadmap"]
        UI_Projects["Portfolio Projects"]
        UI_Interview["Mock Interview Arena"]
        UI_Apps["Job Application Tracker"]
    end

    subgraph Backend["FastAPI ML Engine (Vercel Functions / Port 8000)"]
        M1["Model 1: Skill Classifier (Joblib)"]
        M2["Model 2: TF-IDF Job Matcher (Joblib)"]
        M3["Model 3: Interview Rubric Evaluator (Joblib)"]
        Parser["Document Extraction (PyMuPDF & python-docx)"]
    end

    subgraph Storage["Turso remote SQLite-compatible database"]
        DB[(Turso)]
    end

    Frontend -->|REST APIs| Backend
    Backend --> Storage
```

---

## 2. Machine Learning Pipelines (Zero Paid APIs)

All models are trained with reproducible Python scripts and saved to `ml-service/models/`:

### Model 1: Resume Skill Categorization Classifier
- **Algorithm:** Supervised character/word n-gram `TfidfVectorizer` + multinomial `LogisticRegression`.
- **Taxonomies (8 Domains):** `frontend`, `backend`, `database`, `cloud`, `programming`, `soft_skills`, `data_ml`, `security`.
- **Data:** Synthetic skill phrases with generated paraphrase variants; variants are grouped together during evaluation to prevent train/test leakage.
- **Grouped holdout results:** 32.41% accuracy, 33.65% macro F1, 29.07% weighted F1 on 108 held-out samples (reproduced from the current training run).
- **Limitation:** The low held-out score shows weak transfer to unseen skill phrases. These synthetic results are not evidence of performance on real resumes.
- **Artifact:** `ml-service/models/skill_classifier_pipeline.joblib`

### Model 2: TF-IDF Job Matching & Ranking Engine
- **Algorithm:** Blended TF-IDF Cosine Similarity ($25\%$) + Weighted Direct Skill Overlap ($75\%$).
- **Data and results:** 8 synthetic profile/role examples with manually assigned illustrative relevance labels; current calibration MAE is 13.40%, Pearson $r = 0.9733$, and Spearman $\rho = 0.9701$ on those same examples.
- **Limitation:** This small in-sample benchmark is descriptive only, not an independent or human-validated estimate of job matching performance.
- **Outputs:** Job match score ($0-100\%$), missing skills prioritized by importance, and transparent suitability narrative.
- **Artifact:** `ml-service/models/job_matching_vectorizer.joblib`

### Model 3: Mock Interview Quality & Rubric Evaluator
- **Algorithm:** TF-IDF n-gram vectorizer + multinomial logistic regression for 4 quality tiers (`exemplary`, `proficient`, `developing`, `insufficient`).
- **Scoring Rubric:** Technical concept coverage, topical relevance, and structural clarity.
- **Data:** Synthetic/curated answer examples, including generated paraphrase variants. Grouped cross-validation keeps variants of an answer in the same fold.
- **Grouped cross-validation results:** 0.00% accuracy and 0.00% macro F1 on the current 32-row dataset; the final fitted model's 100% training accuracy is not a generalization result.
- **Limitation:** The classifier does not generalize on this small synthetic dataset. Interview feedback is driven by the transparent rubric and should not be treated as a hiring decision.
- **Artifact:** `ml-service/models/interview_evaluator.joblib`

---

## 3. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend:** Python 3.12, FastAPI, Uvicorn, SQLite3, Pydantic v2.
- **Machine Learning & NLP:** Scikit-Learn, Pandas, NumPy, Joblib, PyMuPDF (`fitz`), `python-docx`.
- **Database:** Normalized SQLite schema with 13 tables, foreign key constraints, and seed data; Turso provides persistent storage in Vercel deployments.

---

## 4. Deploying to Vercel

The application is deployed as two Vercel projects from the same Git repository so the Next.js frontend and Python ML API each use their own runtime. The FastAPI service uses Turso for durable shared data; Vercel function filesystems are temporary and must not be used for user data.

1. Create a Turso database and an auth token. Keep the token private. The API initializes the schema and seed/catalog data on startup.
2. Import the repository into Vercel as the **API** project. Set **Root Directory** to the repository root (`.`), use the detected FastAPI/Python runtime, and set these environment variables for Production and Preview:
   - `TURSO_DATABASE_URL` — the database URL from Turso.
   - `TURSO_AUTH_TOKEN` — the database auth token.
   - `FRONTEND_ORIGINS` — comma-separated exact frontend origins allowed to submit writes, for example `https://career-pivot.vercel.app`.
   - `SESSION_COOKIE_SECURE=true` — Vercel also forces secure cookies automatically.
3. Import the same repository again as the **frontend** project. Set **Root Directory** to `frontend` and use the Next.js framework preset. Set `API_BACKEND_ORIGIN` to the API project's stable HTTPS origin, for example `https://career-pivot-api.vercel.app`. Keep `NEXT_PUBLIC_API_URL` unset or set it to `/api`.
4. Deploy the API first and copy its deployment origin into `API_BACKEND_ORIGIN`. Add the frontend Production and Preview domains to `FRONTEND_ORIGINS` in the API project, then redeploy both projects. The frontend proxies `/api/*` to the API so browser requests and HttpOnly session cookies remain same-origin.

The Python API entrypoint is the root [`main.py`](./main.py); its dependencies come from the root [`requirements.txt`](./requirements.txt). For local development, the API continues to use `careerpivot.db` when Turso credentials are absent. On Vercel, startup fails explicitly if the Turso URL or token is missing rather than silently using an ephemeral database. The API project runs Python 3.12; the scikit-learn version is pinned to match the checked-in model artifacts.

This repository contains deployment configuration, but deployment still requires connecting both Vercel projects and providing Turso credentials in their dashboards. Existing local SQLite user data is not automatically copied to Turso.

## 5. Local Setup & Running Instructions

### Step 1: Clone & Navigate to Workspace
```powershell
cd C:\path\to\CareerPivotAI
```

### Step 2: Prepare Datasets & Train Machine Learning Models
If you need to retrain the included models:
```powershell
cd ml-service
py -3.12 training/prepare_dataset.py
py -3.12 training/train_skill_model.py
py -3.12 training/train_matching_model.py
py -3.12 training/train_interview_model.py
py -3.12 training/evaluate_models.py
cd ..
```

### Step 3: Start the FastAPI Backend (Port 8000)
```powershell
cd ml-service
py -3.12 -m pip install -r requirements.txt
py -3.12 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### Step 4: Start the Next.js Frontend (Port 3000)
Open a new terminal window:
```powershell
cd C:\path\to\CareerPivotAI\frontend
npm run dev
```
Open `http://localhost:3000` in your web browser.
Create an account at `http://localhost:3000/register` or sign in at `http://localhost:3000/login`. The app requires a signed-in account before opening the coaching workspace. Passwords are stored as PBKDF2-SHA256 hashes; sign-in uses a 14-day, HttpOnly session cookie backed by SQLite. For HTTPS deployments, set `SESSION_COOKIE_SECURE=true` and configure `FRONTEND_ORIGINS` with the exact frontend origin.

The default API URL uses `localhost` to keep the frontend and session cookie on the same site. If you change the frontend host or port, update `NEXT_PUBLIC_API_URL` and `FRONTEND_ORIGINS` to match. Existing profile-only records created before password authentication have no stored credentials and cannot be signed into until an administrator securely migrates them; registration will not let someone claim an existing email address without verification.

---

## 6. Main Features & Workflows

1. **Resume Analyzer (`/resume`):**
   - Upload PDF or DOCX files up to 4 MB, or paste resume text.
   - Parses education, work history, projects, and extracts skills using Model 1.
   - Allows manual skill additions and deletions with real-time category updates.

2. **Career Selection (`/career`):**
   - 9 built-in high-demand tech pathways + custom job role builder.
   - Real-time salary ranges, demand ratings, and core skill requirements.

3. **Skill Gap Matrix (`/skill-gap`):**
   - Model 2 matching engine compares candidate profile against job specifications.
   - Interactive Recharts Radar Chart visualizing domain balances.
   - Prioritized missing skill gaps (Essential, Important, Nice-to-have).

4. **Learning Roadmap (`/roadmap`):**
   - 8-week structured transition curriculum.
   - Tasks, practice activities, project deliverables, and resource links.
   - Checkbox tracking with automated progress recalculation.

5. **Portfolio Projects (`/projects`):**
   - Curated architectural projects targeting specific skill gaps.
   - Filter by pathway and difficulty (Beginner, Intermediate, Advanced).

6. **Mock Interview Arena (`/interview`):**
   - Select target role and difficulty (Junior, Mid-level, Senior).
   - Type structured answers; evaluated honestly by Model 3 without fake biometric claims.
   - Displays sub-scores, concept coverage, and targeted improvement suggestions.

7. **Job Application Tracker (`/applications`):**
   - Manage application pipelines (Wishlist, Applied, Screening, Technical, Final, Offer).
   - Real funnel conversion analytics (Interview rate, offer rate, timeline).

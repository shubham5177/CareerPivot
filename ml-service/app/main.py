"""
CareerPivot AI - FastAPI Backend & ML Gateway Service
Provides RESTful APIs for Resume Parsing, ML Skill Extraction, TF-IDF Job Matching,
Mock Interview Evaluation, Learning Roadmaps, and Application Tracking.
"""

import os
import sys
import json
import sqlite3
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Local imports
from .schemas import (
    UserProfileCreate, UserProfileResponse,
    JobRoleSchema, CustomJobRoleRequest, ExtractedSkill, ResumeParseResponse,
    ResumeSaveRequest, JobMatchRequest, JobMatchResponse, LearningRoadmapResponse,
    RoadmapTaskSchema, TaskToggleRequest, PortfolioProjectSchema,
    InterviewQuestionSchema, InterviewEvaluateRequest, InterviewEvaluateResponse,
    JobApplicationCreate, JobApplicationUpdate, ApplicationAnalyticsResponse,
    DashboardSummaryResponse
)
from .resume_parser import (
    extract_text_from_pdf, extract_text_from_docx, clean_text,
    extract_contact_info, parse_resume_sections
)
from .skill_extractor import skill_extractor
from .job_matcher import job_matcher
from .interview_evaluator import interview_evaluator

# Database path setup
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DB_PATH = os.path.join(BASE_DIR, "careerpivot.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "database", "schema.sql")
SEED_PATH = os.path.join(BASE_DIR, "database", "seed.sql")

app = FastAPI(
    title="CareerPivot AI API",
    description="Intelligent Career Transition and Job Readiness ML Backend",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
    finally:
        conn.close()

def init_database():
    """Initializes SQLite database with schema and seed data if not present."""
    print(f"[Database] Checking database at {DB_PATH}")
    db_exists = os.path.exists(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    if os.path.exists(SCHEMA_PATH):
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            cursor.executescript(f.read())
        print("[Database] Schema applied.")

    # Check if job_roles has records; if not, apply seed.sql
    cursor.execute("SELECT COUNT(*) FROM job_roles;")
    count = cursor.fetchone()[0]
    if count == 0 and os.path.exists(SEED_PATH):
        with open(SEED_PATH, "r", encoding="utf-8") as f:
            cursor.executescript(f.read())
        print(f"[Database] Seed data applied successfully.")
    conn.commit()
    conn.close()

@app.on_event("startup")
def startup_event():
    init_database()

# -------------------------------------------------------------------------
# Health Check Endpoint
# -------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CareerPivot AI ML Gateway",
        "timestamp": datetime.utcnow().isoformat(),
        "models": {
            "model_1_skill_classifier": skill_extractor.model is not None,
            "model_2_job_matcher": job_matcher.vectorizer is not None,
            "model_3_interview_evaluator": interview_evaluator.model is not None
        },
        "database": os.path.exists(DB_PATH)
    }

# -------------------------------------------------------------------------
# User Registration & Profile Endpoints
# -------------------------------------------------------------------------
@app.get("/api/users/profile", response_model=UserProfileResponse)
def get_user_profile(user_id: str = "usr-demo-01", db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT u.id, u.name, u.email, u.current_title, u.years_of_experience, u.target_role_id, u.bio, u.created_at,
               r.title as target_role_title
        FROM users u
        LEFT JOIN job_roles r ON u.target_role_id = r.id
        WHERE u.id = ?;
    """, (user_id,))
    row = cursor.fetchone()
    if not row:
        # Create a default profile if not exists
        return UserProfileResponse(
            id=user_id,
            name="Alex Rivera",
            email="alex.rivera@example.com",
            current_title="Junior Software Developer",
            years_of_experience=1.5,
            target_role_id="role-fullstack",
            target_role_title="Full Stack Developer",
            education="B.S. in Computer Science",
            current_skills=["JavaScript", "React", "HTML5 & CSS3", "Tailwind CSS", "RESTful APIs", "SQL"],
            bio="Passionate junior developer transitioning into full-stack web engineering."
        )

    # Fetch skills from latest resume
    cursor.execute("""
        SELECT extracted_skills_json, education_json FROM resumes
        WHERE user_id = ? ORDER BY parsed_at DESC LIMIT 1;
    """, (user_id,))
    res_row = cursor.fetchone()
    current_skills = []
    edu_str = ""
    if res_row:
        if res_row["extracted_skills_json"]:
            try:
                current_skills = json.loads(res_row["extracted_skills_json"])
            except Exception:
                pass
        if res_row["education_json"]:
            try:
                edu_arr = json.loads(res_row["education_json"])
                if edu_arr:
                    edu_str = edu_arr[0].get("degree", "")
            except Exception:
                pass

    return UserProfileResponse(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        current_title=row["current_title"] or "Aspiring Developer",
        years_of_experience=row["years_of_experience"] or 0.0,
        target_role_id=row["target_role_id"],
        target_role_title=row["target_role_title"] or "Full Stack Developer",
        education=edu_str or "Computer Science / STEM",
        current_skills=current_skills if current_skills else ["JavaScript", "React", "SQL"],
        bio=row["bio"] or "",
        created_at=row["created_at"]
    )

@app.post("/api/users/profile", response_model=UserProfileResponse)
def create_or_update_profile(req: UserProfileCreate, user_id: str = "usr-demo-01", db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    exists = cursor.fetchone()

    if exists:
        cursor.execute("""
            UPDATE users
            SET name = ?, email = ?, current_title = ?, years_of_experience = ?, target_role_id = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?;
        """, (req.name, req.email, req.current_title, req.years_of_experience, req.target_role_id, req.bio, user_id))
    else:
        cursor.execute("""
            INSERT INTO users (id, name, email, current_title, years_of_experience, target_role_id, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (user_id, req.name, req.email, req.current_title, req.years_of_experience, req.target_role_id, req.bio))

    # Also sync resume skills and education if provided
    if req.current_skills or req.education:
        edu_list = [{"degree": req.education, "institution": "Self-Directed / University", "year": "Recent"}] if req.education else []
        cursor.execute("""
            SELECT id FROM resumes WHERE user_id = ? ORDER BY parsed_at DESC LIMIT 1;
        """, (user_id,))
        res_exists = cursor.fetchone()
        if res_exists:
            cursor.execute("""
                UPDATE resumes
                SET extracted_skills_json = ?, education_json = ?
                WHERE id = ?;
            """, (json.dumps(req.current_skills or []), json.dumps(edu_list), res_exists[0]))
        else:
            res_id = f"res-{uuid.uuid4().hex[:8]}"
            cursor.execute("""
                INSERT INTO resumes (id, user_id, filename, file_type, raw_text, clean_text, education_json, experience_json, projects_json, extracted_skills_json)
                VALUES (?, ?, 'profile_resume.txt', 'text', 'Profile Created Resume', 'Profile Created Resume', ?, '[]', '[]', ?);
            """, (res_id, user_id, json.dumps(edu_list), json.dumps(req.current_skills or [])))

    db.commit()

    # Return updated profile
    return get_user_profile(user_id=user_id, db=db)

@app.put("/api/users/target-role")
def update_target_role(role_id: str, user_id: str = "usr-demo-01", db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE users SET target_role_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;", (role_id, user_id))
    db.commit()
    return {"status": "updated", "target_role_id": role_id}

# -------------------------------------------------------------------------
# Job Roles Endpoints
# -------------------------------------------------------------------------
@app.get("/api/roles", response_model=List[JobRoleSchema])
def get_job_roles(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT r.id, r.title, r.category, r.description, r.average_salary_range, r.demand_level, r.is_custom
        FROM job_roles r
        ORDER BY r.is_custom ASC, r.title ASC;
    """)
    roles = []
    for row in cursor.fetchall():
        role_dict = dict(row)
        # Fetch associated skills
        cursor.execute("""
            SELECT s.name FROM skill_requirements sr
            JOIN skills s ON sr.skill_id = s.id
            WHERE sr.job_role_id = ?
        """, (role_dict["id"],))
        role_dict["skills"] = [r[0] for r in cursor.fetchall()]
        roles.append(role_dict)
    return roles

@app.post("/api/roles/custom", response_model=JobRoleSchema)
def create_custom_role(req: CustomJobRoleRequest, db: sqlite3.Connection = Depends(get_db)):
    role_id = f"custom-{uuid.uuid4().hex[:8]}"
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO job_roles (id, title, category, description, average_salary_range, demand_level, is_custom)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        """, (role_id, req.title, req.category, req.description, req.average_salary_range, req.demand_level))

        # Insert skill requirements for custom role
        for skill_name in req.required_skills:
            skill_id = f"sk-{uuid.uuid4().hex[:8]}"
            cursor.execute("SELECT id FROM skills WHERE LOWER(name) = LOWER(?)", (skill_name,))
            existing = cursor.fetchone()
            if existing:
                s_id = existing[0]
            else:
                cursor.execute("INSERT INTO skills (id, name, category) VALUES (?, ?, 'programming')", (skill_id, skill_name))
                s_id = skill_id

            cursor.execute("""
                INSERT INTO skill_requirements (id, job_role_id, skill_id, importance, weight)
                VALUES (?, ?, ?, 'Essential', 1.0)
            """, (f"req-{uuid.uuid4().hex[:8]}", role_id, s_id))

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "id": role_id,
        "title": req.title,
        "category": req.category,
        "description": req.description,
        "average_salary_range": req.average_salary_range,
        "demand_level": req.demand_level,
        "is_custom": 1,
        "skills": req.required_skills
    }

# -------------------------------------------------------------------------
# Resume Parsing & Skill Extraction Endpoints (Model 1)
# -------------------------------------------------------------------------
@app.post("/api/resume/parse", response_model=ResumeParseResponse)
async def parse_resume_upload(
    file: Optional[UploadFile] = File(None),
    raw_text_input: Optional[str] = Form(None)
):
    text = ""
    filename = "pasted_resume.txt"
    file_type = "text"

    if file:
        filename = file.filename
        file_bytes = await file.read()
        if filename.lower().endswith(".pdf"):
            file_type = "pdf"
            text = extract_text_from_pdf(file_bytes)
        elif filename.lower().endswith(".docx"):
            file_type = "docx"
            text = extract_text_from_docx(file_bytes)
        else:
            text = file_bytes.decode("utf-8", errors="ignore")
    elif raw_text_input:
        text = raw_text_input
    else:
        raise HTTPException(status_code=400, detail="No file or text provided.")

    clean_content = clean_text(text)
    candidate_name, email, phone = extract_contact_info(clean_content)
    sections = parse_resume_sections(clean_content)

    # Model 1 extraction & classification
    extracted = skill_extractor.extract_skills_from_text(clean_content)

    return {
        "filename": filename,
        "file_type": file_type,
        "raw_text": text,
        "clean_text": clean_content,
        "candidate_name": candidate_name,
        "email": email,
        "phone": phone,
        "education": sections["education"],
        "experience": sections["experience"],
        "projects": sections["projects"],
        "extracted_skills": extracted
    }

@app.post("/api/resume/save")
def save_resume(req: ResumeSaveRequest, db: sqlite3.Connection = Depends(get_db)):
    resume_id = f"res-{uuid.uuid4().hex[:8]}"
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO resumes (id, user_id, filename, file_type, raw_text, clean_text, education_json, experience_json, projects_json, extracted_skills_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        resume_id,
        req.user_id,
        req.filename,
        req.file_type,
        req.raw_text,
        req.clean_text,
        json.dumps(req.education),
        json.dumps(req.experience),
        json.dumps(req.projects),
        json.dumps(req.extracted_skills)
    ))
    db.commit()
    return {"status": "saved", "resume_id": resume_id}

@app.get("/api/resume/latest")
def get_latest_resume(user_id: str = "usr-demo-01", db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT id, filename, file_type, raw_text, clean_text, education_json, experience_json, projects_json, extracted_skills_json, parsed_at
        FROM resumes
        WHERE user_id = ?
        ORDER BY parsed_at DESC LIMIT 1;
    """, (user_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="No resume found for user.")
    return {
        "id": row["id"],
        "filename": row["filename"],
        "file_type": row["file_type"],
        "raw_text": row["raw_text"],
        "clean_text": row["clean_text"],
        "education": json.loads(row["education_json"]) if row["education_json"] else [],
        "experience": json.loads(row["experience_json"]) if row["experience_json"] else [],
        "projects": json.loads(row["projects_json"]) if row["projects_json"] else [],
        "extracted_skills": json.loads(row["extracted_skills_json"]) if row["extracted_skills_json"] else [],
        "parsed_at": row["parsed_at"]
    }

# -------------------------------------------------------------------------
# Job Matching & Skill Gap Analysis Endpoints (Model 2)
# -------------------------------------------------------------------------
@app.post("/api/match/evaluate", response_model=JobMatchResponse)
def evaluate_job_match(req: JobMatchRequest, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()

    role_info = {}
    required_skills_list = []

    if req.job_role_id:
        cursor.execute("SELECT id, title, description, category FROM job_roles WHERE id = ?", (req.job_role_id,))
        r = cursor.fetchone()
        if r:
            role_info = dict(r)

        cursor.execute("""
            SELECT s.name, s.category, sr.importance, sr.weight
            FROM skill_requirements sr
            JOIN skills s ON sr.skill_id = s.id
            WHERE sr.job_role_id = ?
        """, (req.job_role_id,))
        for s_row in cursor.fetchall():
            required_skills_list.append(dict(s_row))
    else:
        role_info = {
            "id": "custom",
            "title": "Custom Target Role",
            "description": req.custom_job_description or "Custom software role",
            "category": "Custom"
        }
        for s in (req.custom_required_skills or []):
            required_skills_list.append({
                "name": s,
                "category": "programming",
                "importance": "Essential",
                "weight": 1.0
            })

    # Run Model 2 matching engine
    result = job_matcher.evaluate_match(
        resume_skills=req.resume_skills,
        role_info=role_info,
        required_skills_list=required_skills_list,
        custom_jd=req.custom_job_description
    )

    # Persist skill gap result if linked to user
    if req.user_id and req.job_role_id:
        gap_id = f"gap-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO skill_gaps (id, user_id, job_role_id, match_score, matched_skills_json, missing_skills_json, suitability_explanation)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            gap_id,
            req.user_id,
            req.job_role_id,
            result["match_score"],
            json.dumps(result["matched_skills"]),
            json.dumps([m["skill_name"] for m in result["missing_skills"]]),
            result["suitability_explanation"]
        ))
        db.commit()

    return result

# -------------------------------------------------------------------------
# Learning Roadmap Endpoints
# -------------------------------------------------------------------------
@app.get("/api/roadmap", response_model=LearningRoadmapResponse)
def get_user_roadmap(
    user_id: str = "usr-demo-01",
    role_id: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    # Find existing roadmap for user
    if role_id:
        cursor.execute("SELECT * FROM learning_roadmaps WHERE user_id = ? AND job_role_id = ? ORDER BY created_at DESC LIMIT 1;", (user_id, role_id))
    else:
        cursor.execute("SELECT * FROM learning_roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;", (user_id,))

    roadmap = cursor.fetchone()
    if not roadmap:
        # If no roadmap exists yet, create one from default templates
        target_role = role_id or "role-fullstack"
        cursor.execute("SELECT title FROM job_roles WHERE id = ?", (target_role,))
        r_title = cursor.fetchone()
        role_title_str = r_title[0] if r_title else "Software Engineering"

        roadmap_id = f"rdm-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO learning_roadmaps (id, user_id, job_role_id, title, summary, total_weeks, progress_percentage, status)
            VALUES (?, ?, ?, ?, ?, 8, 0.0, 'in_progress')
        """, (
            roadmap_id, user_id, target_role,
            f"8-Week {role_title_str} Readiness Roadmap",
            f"Personalized weekly mastery path covering skill gaps for {role_title_str}."
        ))

        # Seed standard weekly milestones
        weeks_data = [
            (1, "Core Language Foundations & Types", ["Data structures", "Type safety", "Clean code patterns"], ["Solve 5 algorithm challenges", "Implement custom collection"], "Typed Core Module"),
            (2, "Modern Frameworks & Architecture", ["Component design", "State management", "Routing patterns"], ["Build modular component library", "Benchmark render performance"], "Framework Architecture App"),
            (3, "Databases & Data Modeling", ["Relational modeling", "Indexing & Transactions", "Query profiling"], ["Design normalized schema with foreign keys", "Write EXPLAIN ANALYZE benchmarks"], "Production Database Schema"),
            (4, "Backend APIs & Authentication", ["REST/GraphQL design", "JWT and session security", "Middleware validation"], ["Build secure authentication API", "Implement rate limiter middleware"], "Production Microservice API"),
            (5, "Containerization & Cloud Dev", ["Docker multi-stage builds", "Docker Compose", "Environment config"], ["Containerize full app stack", "Optimize Docker image size < 150MB"], "Containerized Local Cluster"),
            (6, "Caching & Performance Optimization", ["In-memory Redis caching", "Cache invalidation", "Async queues"], ["Implement cache-aside pattern", "Set up background worker queue"], "High-Throughput Caching Layer"),
            (7, "CI/CD & Cloud Deployment", ["GitHub Actions workflows", "Automated test suites", "Cloud hosting"], ["Configure CI pipeline with lint/test", "Deploy live staging environment"], "Live CI/CD Deployment"),
            (8, "Capstone Portfolio Project & Polish", ["Full stack architecture", "API documentation", "Performance profiling"], ["Conduct load testing", "Record technical architecture walkthrough"], "Production Capstone Project")
        ]

        for w_num, w_title, w_topics, w_acts, w_mile in weeks_data:
            cursor.execute("""
                INSERT INTO roadmap_tasks (id, roadmap_id, week_number, title, description, topics_json, practice_activities_json, project_milestone, recommended_resources_json, is_completed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            """, (
                f"tsk-{uuid.uuid4().hex[:8]}", roadmap_id, w_num, w_title,
                f"Master core competencies for week {w_num} of your transition.",
                json.dumps(w_topics), json.dumps(w_acts), w_mile,
                json.dumps(["Official Documentation", "Recommended Interactive Lab"])
            ))
        db.commit()
        cursor.execute("SELECT * FROM learning_roadmaps WHERE id = ?", (roadmap_id,))
        roadmap = cursor.fetchone()

    # Fetch tasks
    cursor.execute("SELECT * FROM roadmap_tasks WHERE roadmap_id = ? ORDER BY week_number ASC;", (roadmap["id"],))
    task_rows = cursor.fetchall()
    tasks = []
    completed_cnt = 0
    for t in task_rows:
        is_comp = bool(t["is_completed"])
        if is_comp:
            completed_cnt += 1
        tasks.append(RoadmapTaskSchema(
            id=t["id"],
            roadmap_id=t["roadmap_id"],
            week_number=t["week_number"],
            title=t["title"],
            description=t["description"],
            topics=json.loads(t["topics_json"]) if t["topics_json"] else [],
            practice_activities=json.loads(t["practice_activities_json"]) if t["practice_activities_json"] else [],
            project_milestone=t["project_milestone"],
            recommended_resources=json.loads(t["recommended_resources_json"]) if t["recommended_resources_json"] else [],
            is_completed=is_comp,
            completed_at=t["completed_at"]
        ))

    # Calculate live progress
    progress_pct = round((completed_cnt / max(1, len(tasks))) * 100, 1)

    # Get role title
    cursor.execute("SELECT title FROM job_roles WHERE id = ?", (roadmap["job_role_id"],))
    role_t = cursor.fetchone()
    role_title_str = role_t[0] if role_t else "Software Engineer"

    return LearningRoadmapResponse(
        id=roadmap["id"],
        user_id=roadmap["user_id"],
        job_role_id=roadmap["job_role_id"],
        role_title=role_title_str,
        title=roadmap["title"],
        summary=roadmap["summary"],
        total_weeks=roadmap["total_weeks"],
        progress_percentage=progress_pct,
        status=roadmap["status"],
        tasks=tasks
    )

@app.put("/api/roadmap/tasks/{task_id}/toggle")
def toggle_roadmap_task(
    task_id: str,
    req: TaskToggleRequest,
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("SELECT roadmap_id, week_number FROM roadmap_tasks WHERE id = ?", (task_id,))
    task = cursor.fetchone()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    completed_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S") if req.is_completed else None
    cursor.execute("""
        UPDATE roadmap_tasks
        SET is_completed = ?, completed_at = ?
        WHERE id = ?
    """, (1 if req.is_completed else 0, completed_at, task_id))

    # Recalculate roadmap progress
    roadmap_id = task["roadmap_id"]
    cursor.execute("SELECT COUNT(*), SUM(is_completed) FROM roadmap_tasks WHERE roadmap_id = ?", (roadmap_id,))
    total_tasks, completed_tasks = cursor.fetchone()
    completed_tasks = completed_tasks or 0
    new_progress = round((completed_tasks / max(1, total_tasks)) * 100, 1)

    status = "completed" if new_progress == 100.0 else "in_progress"
    cursor.execute("""
        UPDATE learning_roadmaps
        SET progress_percentage = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (new_progress, status, roadmap_id))

    db.commit()
    return {
        "task_id": task_id,
        "is_completed": req.is_completed,
        "new_progress_percentage": new_progress,
        "status": status
    }

# -------------------------------------------------------------------------
# Portfolio Projects Endpoints
# -------------------------------------------------------------------------
@app.get("/api/projects", response_model=List[PortfolioProjectSchema])
def get_portfolio_projects(
    role_id: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    query = "SELECT * FROM portfolio_projects WHERE 1=1"
    params = []

    if role_id:
        query += " AND job_role_id = ?"
        params.append(role_id)
    if difficulty:
        query += " AND difficulty = ?"
        params.append(difficulty)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    projects = []
    for r in rows:
        projects.append(PortfolioProjectSchema(
            id=r["id"],
            job_role_id=r["job_role_id"],
            title=r["title"],
            difficulty=r["difficulty"],
            summary=r["summary"],
            required_technologies=json.loads(r["required_technologies_json"]) if r["required_technologies_json"] else [],
            skills_gained=json.loads(r["skills_gained_json"]) if r["skills_gained_json"] else [],
            expected_outcome=r["expected_outcome"],
            architecture_overview=r["architecture_overview"],
            github_starter_url=r["github_starter_url"],
            status=r["status"]
        ))
    return projects

# -------------------------------------------------------------------------
# Mock Interview Endpoints (Model 3)
# -------------------------------------------------------------------------
INTERVIEW_QUESTIONS_BANK = {
    "role-frontend": [
        {
            "id": "q-fe-1",
            "question_text": "What is the React Virtual DOM, and how does the reconciliation algorithm minimize browser reflows?",
            "category": "Frontend Architecture",
            "difficulty": "Mid-level",
            "expected_concepts": ["virtual DOM", "reconciliation", "diffing", "browser reflow", "real DOM updates", "batching"],
            "hints": "Contrast in-memory JavaScript representations with direct document tree updates."
        },
        {
            "id": "q-fe-2",
            "question_text": "Explain the difference between Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG).",
            "category": "Web Performance",
            "difficulty": "Mid-level",
            "expected_concepts": ["CSR", "SSR", "SSG", "hydration", "SEO", "TTFB", "build time"],
            "hints": "Discuss where HTML is generated and the trade-offs on initial page load vs interactivity."
        },
        {
            "id": "q-fe-3",
            "question_text": "How do you optimize the performance of a React application experiencing laggy re-renders?",
            "category": "Performance Optimization",
            "difficulty": "Senior",
            "expected_concepts": ["useMemo", "useCallback", "React.memo", "lazy loading", "virtualization", "profiler"],
            "hints": "Mention profiling tools, component splitting, and avoiding anonymous inline functions."
        }
    ],
    "role-backend": [
        {
            "id": "q-be-1",
            "question_text": "Explain the difference between SQL and NoSQL databases. When would you choose one over the other in production?",
            "category": "Database Architecture",
            "difficulty": "Mid-level",
            "expected_concepts": ["relational", "ACID", "schema", "NoSQL", "horizontal scaling", "document store", "use cases"],
            "hints": "Discuss transactions and consistency versus partition tolerance and flexible schema."
        },
        {
            "id": "q-be-2",
            "question_text": "How do database indexes work under the hood, and what are the trade-offs of adding too many indexes?",
            "category": "Database Performance",
            "difficulty": "Mid-level",
            "expected_concepts": ["B-tree", "lookup speed", "write overhead", "storage", "insert performance", "query execution plan"],
            "hints": "Explain why reads get faster while writes get slower due to index tree maintenance."
        },
        {
            "id": "q-be-3",
            "question_text": "How would you design an idempotent API endpoint for processing credit card payments?",
            "category": "System Design",
            "difficulty": "Senior",
            "expected_concepts": ["idempotency key", "distributed lock", "transaction state", "double charge prevention", "atomic commit"],
            "hints": "Walk through client request retries, caching transaction status, and database locks."
        }
    ],
    "role-fullstack": [
        {
            "id": "q-fs-1",
            "question_text": "Walk through how authentication works from the frontend client to the backend API using JWT and secure cookies.",
            "category": "Security & Architecture",
            "difficulty": "Mid-level",
            "expected_concepts": ["JWT", "HttpOnly cookie", "refresh token", "access token", "XSS", "CSRF", "authorization header"],
            "hints": "Address why localStorage is vulnerable to XSS and how HttpOnly cookies protect session tokens."
        },
        {
            "id": "q-fs-2",
            "question_text": "How does React Server Components (RSC) change the data-fetching boundary between client and server?",
            "category": "Full Stack Architecture",
            "difficulty": "Senior",
            "expected_concepts": ["RSC", "server boundary", "bundle size reduction", "database direct fetch", "client hydration", "server actions"],
            "hints": "Explain what stays on the server and what bundle payload reaches the browser."
        }
    ],
    "role-data-scientist": [
        {
            "id": "q-ds-1",
            "question_text": "What is the difference between overfitting and underfitting in machine learning, and how do you diagnose and prevent each?",
            "category": "Machine Learning Fundamentals",
            "difficulty": "Mid-level",
            "expected_concepts": ["overfitting", "underfitting", "generalization", "regularization", "cross-validation", "feature engineering", "bias-variance"],
            "hints": "Compare training error versus validation error curves."
        },
        {
            "id": "q-ds-2",
            "question_text": "When would you choose Precision over Recall as your primary evaluation metric, and how does F1 score balance them?",
            "category": "Model Evaluation",
            "difficulty": "Junior",
            "expected_concepts": ["precision", "recall", "false positive", "false negative", "harmonic mean", "F1 score"],
            "hints": "Give real-world examples like spam filtering vs cancer diagnosis."
        }
    ],
    "role-cloud-engineer": [
        {
            "id": "q-cl-1",
            "question_text": "Explain how Docker containers differ from Virtual Machines, particularly regarding kernel sharing and resource isolation.",
            "category": "Cloud & Infrastructure",
            "difficulty": "Junior",
            "expected_concepts": ["shared kernel", "namespaces", "cgroups", "hypervisor", "guest OS", "isolation", "overhead"],
            "hints": "Contrast OS-level virtualization with hardware virtualization."
        },
        {
            "id": "q-cl-2",
            "question_text": "How do you implement zero-downtime rolling deployments in Kubernetes, and what role do readiness and liveness probes play?",
            "category": "DevOps & Orchestration",
            "difficulty": "Senior",
            "expected_concepts": ["rolling update", "readiness probe", "liveness probe", "maxUnavailable", "maxSurge", "traffic routing"],
            "hints": "Explain how kube-proxy routes traffic only when probes report healthy."
        }
    ]
}

@app.get("/api/interview/questions", response_model=List[InterviewQuestionSchema])
def get_interview_questions(
    role_id: str = "role-fullstack",
    difficulty: Optional[str] = None
):
    questions = INTERVIEW_QUESTIONS_BANK.get(role_id, INTERVIEW_QUESTIONS_BANK["role-fullstack"])
    if difficulty:
        filtered = [q for q in questions if q["difficulty"].lower() == difficulty.lower()]
        return filtered if filtered else questions
    return questions

@app.post("/api/interview/evaluate", response_model=InterviewEvaluateResponse)
def evaluate_interview_answer(
    req: InterviewEvaluateRequest,
    db: sqlite3.Connection = Depends(get_db)
):
    # Run Model 3 evaluation
    eval_result = interview_evaluator.evaluate_answer(
        question_text=req.question_text,
        user_answer=req.user_answer,
        expected_concepts=req.expected_concepts,
        category=req.category
    )

    session_id = f"sess-{uuid.uuid4().hex[:8]}"
    answer_id = f"ans-{uuid.uuid4().hex[:8]}"
    cursor = db.cursor()

    # Save session
    cursor.execute("""
        INSERT INTO interview_sessions (id, user_id, job_role_id, difficulty, overall_score, feedback_summary)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        session_id, req.user_id, req.job_role_id, req.difficulty,
        eval_result["overall_answer_score"], eval_result["rubric_feedback"]
    ))

    # Save answer
    cursor.execute("""
        INSERT INTO interview_answers (id, session_id, question_text, category, user_answer, relevance_score, technical_coverage_score, structure_score, overall_answer_score, covered_concepts_json, missing_concepts_json, improvement_suggestions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        answer_id, session_id, req.question_text, req.category, req.user_answer,
        eval_result["relevance_score"], eval_result["technical_coverage_score"],
        eval_result["structure_score"], eval_result["overall_answer_score"],
        json.dumps(eval_result["covered_concepts"]),
        json.dumps(eval_result["missing_concepts"]),
        json.dumps(eval_result["improvement_suggestions"])
    ))
    db.commit()

    return {
        "session_id": session_id,
        "relevance_score": eval_result["relevance_score"],
        "technical_coverage_score": eval_result["technical_coverage_score"],
        "structure_score": eval_result["structure_score"],
        "overall_answer_score": eval_result["overall_answer_score"],
        "quality_tier": eval_result["quality_tier"],
        "covered_concepts": eval_result["covered_concepts"],
        "missing_concepts": eval_result["missing_concepts"],
        "rubric_feedback": eval_result["rubric_feedback"],
        "improvement_suggestions": eval_result["improvement_suggestions"]
    }

@app.get("/api/interview/history")
def get_interview_history(
    user_id: str = "usr-demo-01",
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("""
        SELECT s.id, s.job_role_id, r.title as role_title, s.difficulty, s.overall_score, s.feedback_summary, s.created_at,
               a.question_text, a.user_answer, a.relevance_score, a.technical_coverage_score, a.structure_score, a.covered_concepts_json, a.missing_concepts_json, a.improvement_suggestions
        FROM interview_sessions s
        JOIN job_roles r ON s.job_role_id = r.id
        LEFT JOIN interview_answers a ON s.id = a.session_id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC LIMIT 10;
    """, (user_id,))

    history = []
    for row in cursor.fetchall():
        r = dict(row)
        r["covered_concepts"] = json.loads(r["covered_concepts_json"]) if r["covered_concepts_json"] else []
        r["missing_concepts"] = json.loads(r["missing_concepts_json"]) if r["missing_concepts_json"] else []
        r["improvement_suggestions"] = json.loads(r["improvement_suggestions"]) if r["improvement_suggestions"] else []
        history.append(r)
    return history

# -------------------------------------------------------------------------
# Job Application Tracker Endpoints
# -------------------------------------------------------------------------
@app.get("/api/applications")
def get_job_applications(
    user_id: str = "usr-demo-01",
    status: Optional[str] = None,
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    query = """
        SELECT a.*, r.title as target_role_title
        FROM job_applications a
        LEFT JOIN job_roles r ON a.target_role_id = r.id
        WHERE a.user_id = ?
    """
    params = [user_id]
    if status:
        query += " AND a.status = ?"
        params.append(status)
    query += " ORDER BY a.application_date DESC, a.created_at DESC;"

    cursor.execute(query, params)
    return [dict(r) for r in cursor.fetchall()]

@app.post("/api/applications")
def create_job_application(
    req: JobApplicationCreate,
    db: sqlite3.Connection = Depends(get_db)
):
    app_id = f"app-{uuid.uuid4().hex[:8]}"
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO job_applications (id, user_id, company, job_title, target_role_id, location, salary_range, job_description, status, application_date, interview_date, outcome_notes, match_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        app_id, req.user_id, req.company, req.job_title, req.target_role_id,
        req.location, req.salary_range, req.job_description, req.status,
        req.application_date, req.interview_date, req.outcome_notes, req.match_score
    ))
    db.commit()
    return {"status": "created", "application_id": app_id}

@app.put("/api/applications/{app_id}")
def update_job_application(
    app_id: str,
    req: JobApplicationUpdate,
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    fields = []
    values = []

    if req.company is not None:
        fields.append("company = ?")
        values.append(req.company)
    if req.job_title is not None:
        fields.append("job_title = ?")
        values.append(req.job_title)
    if req.status is not None:
        fields.append("status = ?")
        values.append(req.status)
    if req.interview_date is not None:
        fields.append("interview_date = ?")
        values.append(req.interview_date)
    if req.outcome_notes is not None:
        fields.append("outcome_notes = ?")
        values.append(req.outcome_notes)
    if req.match_score is not None:
        fields.append("match_score = ?")
        values.append(req.match_score)

    if not fields:
        return {"status": "no_changes"}

    fields.append("updated_at = CURRENT_TIMESTAMP")
    values.append(app_id)
    cursor.execute(f"UPDATE job_applications SET {', '.join(fields)} WHERE id = ?", values)
    db.commit()
    return {"status": "updated", "application_id": app_id}

@app.delete("/api/applications/{app_id}")
def delete_job_application(app_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM job_applications WHERE id = ?", (app_id,))
    db.commit()
    return {"status": "deleted", "application_id": app_id}

@app.get("/api/applications/analytics", response_model=ApplicationAnalyticsResponse)
def get_application_analytics(
    user_id: str = "usr-demo-01",
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("SELECT status, target_role_id, application_date FROM job_applications WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()

    total = len(rows)
    status_counts = {"Wishlist": 0, "Applied": 0, "Screening": 0, "Technical Interview": 0, "Final Round": 0, "Offer": 0, "Rejected": 0}
    role_counts = {}
    dates = []

    for r in rows:
        st = r["status"]
        if st in status_counts:
            status_counts[st] += 1
        rid = r["target_role_id"] or "General"
        if rid not in role_counts:
            role_counts[rid] = {"total": 0, "interviews": 0, "offers": 0}
        role_counts[rid]["total"] += 1
        if st in ["Screening", "Technical Interview", "Final Round", "Offer"]:
            role_counts[rid]["interviews"] += 1
        if st == "Offer":
            role_counts[rid]["offers"] += 1
        if r["application_date"]:
            dates.append(r["application_date"])

    interview_active = status_counts["Screening"] + status_counts["Technical Interview"] + status_counts["Final Round"] + status_counts["Offer"]
    applied_total = status_counts["Applied"] + interview_active + status_counts["Rejected"]

    interview_conv = round((interview_active / max(1, applied_total)) * 100, 1)
    offer_conv = round((status_counts["Offer"] / max(1, interview_active)) * 100, 1) if interview_active > 0 else 0.0

    timeline = [
        {"stage": "Wishlist", "count": status_counts["Wishlist"]},
        {"stage": "Applied", "count": status_counts["Applied"]},
        {"stage": "Interviewing", "count": interview_active},
        {"stage": "Offers", "count": status_counts["Offer"]},
        {"stage": "Rejected", "count": status_counts["Rejected"]},
    ]

    return ApplicationAnalyticsResponse(
        total_applications=total,
        applied_count=status_counts["Applied"],
        interview_count=interview_active,
        offer_count=status_counts["Offer"],
        rejected_count=status_counts["Rejected"],
        wishlist_count=status_counts["Wishlist"],
        interview_conversion_rate=interview_conv,
        offer_conversion_rate=offer_conv,
        role_performance=role_counts,
        timeline_stats=timeline
    )

# -------------------------------------------------------------------------
# Main Dashboard Summary Endpoint
# -------------------------------------------------------------------------
@app.get("/api/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    user_id: str = "usr-demo-01",
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()

    # User info
    cursor.execute("SELECT u.name, u.current_title, r.title as target_title, u.target_role_id FROM users u LEFT JOIN job_roles r ON u.target_role_id = r.id WHERE u.id = ?", (user_id,))
    u_row = cursor.fetchone()
    user_name = u_row["name"] if u_row else "Alex Rivera"
    curr_title = u_row["current_title"] if u_row else "Software Developer"
    target_role_title = u_row["target_title"] if u_row and u_row["target_title"] else "Full Stack Developer"
    target_role_id = u_row["target_role_id"] if u_row else "role-fullstack"

    # Latest resume & match score
    cursor.execute("SELECT extracted_skills_json FROM resumes WHERE user_id = ? ORDER BY parsed_at DESC LIMIT 1;", (user_id,))
    res_row = cursor.fetchone()
    detected_skills = json.loads(res_row["extracted_skills_json"]) if res_row and res_row["extracted_skills_json"] else []

    cursor.execute("SELECT match_score, missing_skills_json FROM skill_gaps WHERE user_id = ? ORDER BY analyzed_at DESC LIMIT 1;", (user_id,))
    gap_row = cursor.fetchone()
    match_score = gap_row["match_score"] if gap_row else 68.5
    missing_skills = json.loads(gap_row["missing_skills_json"]) if gap_row and gap_row["missing_skills_json"] else []

    # Roadmap progress
    cursor.execute("SELECT id, total_weeks, progress_percentage FROM learning_roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;", (user_id,))
    rdm_row = cursor.fetchone()
    rdm_pct = rdm_row["progress_percentage"] if rdm_row else 37.5
    total_weeks = rdm_row["total_weeks"] if rdm_row else 8

    cursor.execute("SELECT COUNT(*) FROM roadmap_tasks WHERE roadmap_id = ? AND is_completed = 1;", (rdm_row["id"] if rdm_row else "",))
    comp_weeks = cursor.fetchone()[0] if rdm_row else 3

    # Interview performance
    cursor.execute("SELECT AVG(overall_score), COUNT(*) FROM interview_sessions WHERE user_id = ?;", (user_id,))
    avg_score, iv_count = cursor.fetchone()
    avg_score = round(float(avg_score), 1) if avg_score else 84.5
    iv_count = iv_count or 1

    # Applications
    cursor.execute("SELECT COUNT(*) FROM job_applications WHERE user_id = ?;", (user_id,))
    total_apps = cursor.fetchone()[0] or 5
    cursor.execute("SELECT COUNT(*) FROM job_applications WHERE user_id = ? AND status IN ('Applied', 'Screening', 'Technical Interview', 'Final Round');", (user_id,))
    active_apps = cursor.fetchone()[0] or 4

    # Personalized next steps
    next_steps = [
        {"title": "Complete Week 4 Roadmap Module", "description": "Finish backend API authentication and rate limiting tasks.", "action_url": "/roadmap", "type": "roadmap"},
        {"title": "Bridge Key Essential Skill Gap", "description": f"Master {missing_skills[0] if missing_skills else 'TypeScript'} to boost match score beyond 80%.", "action_url": "/skill-gap", "type": "skill"},
        {"title": "Take a Mock Interview", "description": "Practice system design & React state questions before your next screening.", "action_url": "/interview", "type": "interview"},
        {"title": "Follow up with Stripe & Vercel", "description": "Review final round interview preparations.", "action_url": "/applications", "type": "applications"}
    ]

    return DashboardSummaryResponse(
        user_name=user_name,
        current_title=curr_title,
        target_role_title=target_role_title,
        resume_match_score=match_score,
        total_skills_detected=len(detected_skills),
        missing_skills_count=len(missing_skills),
        roadmap_progress_percentage=rdm_pct,
        completed_roadmap_weeks=comp_weeks,
        total_roadmap_weeks=total_weeks,
        average_interview_score=avg_score,
        total_interviews_taken=iv_count,
        active_applications_count=active_apps,
        total_applications_count=total_apps,
        recommended_next_steps=next_steps
    )

-- CareerPivot AI Database Schema
-- SQLite dialect with foreign keys enabled

PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    current_title TEXT,
    years_of_experience REAL DEFAULT 0.0,
    target_role_id TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_role_id) REFERENCES job_roles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY,
    education_json TEXT NOT NULL DEFAULT '[]',
    current_skills_json TEXT NOT NULL DEFAULT '[]',
    experience_json TEXT NOT NULL DEFAULT '[]',
    career_interests_json TEXT NOT NULL DEFAULT '[]',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_accounts (
    user_id TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);

-- Job Roles
CREATE TABLE IF NOT EXISTS job_roles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- Software Engineering, Data & AI, Cloud & Security, etc.
    description TEXT NOT NULL,
    average_salary_range TEXT,
    demand_level TEXT DEFAULT 'High', -- High, Very High, Moderate
    is_custom INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skills Master
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- frontend, backend, database, cloud, programming, soft_skills, data_ml, security
    description TEXT
);

-- Skill Requirements for Job Roles
CREATE TABLE IF NOT EXISTS skill_requirements (
    id TEXT PRIMARY KEY,
    job_role_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    importance TEXT NOT NULL CHECK(importance IN ('Essential', 'Important', 'Nice-to-have')),
    weight REAL DEFAULT 1.0, -- Used in match score calculations
    minimum_proficiency TEXT DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(job_role_id, skill_id)
);

-- Resumes
CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL, -- pdf, docx, text
    raw_text TEXT NOT NULL,
    clean_text TEXT,
    education_json TEXT, -- JSON array of education objects
    experience_json TEXT, -- JSON array of experience objects
    projects_json TEXT, -- JSON array of projects
    certifications_json TEXT, -- JSON array of certifications
    extracted_skills_json TEXT, -- JSON array of skill names/categories
    parsed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skill Gaps Analysis
CREATE TABLE IF NOT EXISTS skill_gaps (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    resume_id TEXT,
    job_role_id TEXT NOT NULL,
    match_score REAL NOT NULL, -- 0 - 100
    matched_skills_json TEXT NOT NULL, -- JSON array
    missing_skills_json TEXT NOT NULL, -- JSON array
    suitability_explanation TEXT,
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE
);

-- Learning Roadmaps
CREATE TABLE IF NOT EXISTS learning_roadmaps (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    job_role_id TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    total_weeks INTEGER NOT NULL DEFAULT 8,
    progress_percentage REAL DEFAULT 0.0,
    status TEXT DEFAULT 'in_progress', -- in_progress, completed, paused
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE
);

-- Roadmap Weekly Tasks / Milestones
CREATE TABLE IF NOT EXISTS roadmap_tasks (
    id TEXT PRIMARY KEY,
    roadmap_id TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    topics_json TEXT, -- JSON array of specific topics
    practice_activities_json TEXT, -- JSON array
    project_milestone TEXT,
    recommended_resources_json TEXT, -- JSON array of resource links/names
    is_completed INTEGER DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (roadmap_id) REFERENCES learning_roadmaps(id) ON DELETE CASCADE
);

-- Portfolio Projects Recommended / Tracked
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id TEXT PRIMARY KEY,
    job_role_id TEXT NOT NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    summary TEXT NOT NULL,
    required_technologies_json TEXT NOT NULL, -- JSON array
    skills_gained_json TEXT NOT NULL, -- JSON array
    expected_outcome TEXT NOT NULL,
    architecture_overview TEXT,
    github_starter_url TEXT,
    user_id TEXT, -- If customized or adopted by user
    status TEXT DEFAULT 'recommended', -- recommended, in_progress, completed
    completion_date DATETIME,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    job_role_id TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('Junior', 'Mid-level', 'Senior')),
    overall_score REAL DEFAULT 0.0,
    feedback_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE
);

-- Interview Answers
CREATE TABLE IF NOT EXISTS interview_answers (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    question_text TEXT NOT NULL,
    category TEXT,
    user_answer TEXT NOT NULL,
    relevance_score REAL NOT NULL, -- 0-100
    technical_coverage_score REAL NOT NULL, -- 0-100
    structure_score REAL NOT NULL, -- 0-100
    overall_answer_score REAL NOT NULL, -- 0-100
    covered_concepts_json TEXT, -- JSON array
    missing_concepts_json TEXT, -- JSON array
    improvement_suggestions TEXT,
    evaluated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- Job Applications Tracker
CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    company TEXT NOT NULL,
    job_title TEXT NOT NULL,
    target_role_id TEXT,
    location TEXT DEFAULT 'Remote',
    salary_range TEXT,
    job_description TEXT,
    status TEXT NOT NULL CHECK(status IN ('Wishlist', 'Applied', 'Screening', 'Technical Interview', 'Final Round', 'Offer', 'Rejected')),
    application_date DATE NOT NULL,
    interview_date DATE,
    outcome_notes TEXT,
    match_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_role_id) REFERENCES job_roles(id) ON DELETE SET NULL
);

-- Progress Records for Analytics & Adjusting Recommendations
CREATE TABLE IF NOT EXISTS progress_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    record_type TEXT NOT NULL, -- roadmap_completion, quiz, interview, project_done
    details_json TEXT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_req_role ON skill_requirements(job_role_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_roadmap ON roadmap_tasks(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session ON interview_answers(session_id);

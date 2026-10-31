"""
CareerPivot AI - Pydantic Request & Response Schemas
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# User & Role Schemas
class JobRoleSchema(BaseModel):
    id: str
    title: str
    category: str
    description: str
    average_salary_range: Optional[str] = None
    demand_level: str = "High"
    is_custom: int = 0
    skills: Optional[List[str]] = []

class CustomJobRoleRequest(BaseModel):
    title: str
    category: str = "Custom Domain"
    description: str
    average_salary_range: Optional[str] = "$90,000 - $140,000"
    demand_level: str = "High"
    required_skills: List[str]

# Skill Schemas
class ExtractedSkill(BaseModel):
    name: str
    category: str
    confidence: float = 1.0

class ResumeParseResponse(BaseModel):
    filename: str
    file_type: str
    raw_text: str
    clean_text: str
    candidate_name: Optional[str] = "Applicant"
    email: Optional[str] = ""
    phone: Optional[str] = ""
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    extracted_skills: List[ExtractedSkill] = []

class ResumeSaveRequest(BaseModel):
    user_id: str = "usr-demo-01"
    filename: str
    file_type: str
    raw_text: str
    clean_text: str
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    extracted_skills: List[str] = []

# Job Matching & Skill Gap Schemas
class JobMatchRequest(BaseModel):
    user_id: Optional[str] = "usr-demo-01"
    resume_skills: List[str]
    job_role_id: Optional[str] = None
    custom_job_description: Optional[str] = None
    custom_required_skills: Optional[List[str]] = None

class SkillGapDetail(BaseModel):
    skill_name: str
    category: str
    importance: str  # Essential, Important, Nice-to-have
    weight: float = 1.0
    recommended_action: str

class JobMatchResponse(BaseModel):
    job_role_id: Optional[str]
    job_title: str
    match_score: float  # 0-100%
    skill_gap_percentage: float  # 100 - match_score
    matched_skills: List[str]
    missing_skills: List[SkillGapDetail]
    suitability_explanation: str
    category_breakdown: Dict[str, Dict[str, int]]  # category -> {matched: X, total: Y}

# Learning Roadmap Schemas
class RoadmapTaskSchema(BaseModel):
    id: str
    roadmap_id: str
    week_number: int
    title: str
    description: Optional[str]
    topics: List[str] = []
    practice_activities: List[str] = []
    project_milestone: Optional[str]
    recommended_resources: List[str] = []
    is_completed: bool = False
    completed_at: Optional[str] = None

class LearningRoadmapResponse(BaseModel):
    id: str
    user_id: str
    job_role_id: str
    role_title: str
    title: str
    summary: str
    total_weeks: int
    progress_percentage: float
    status: str
    tasks: List[RoadmapTaskSchema]

class TaskToggleRequest(BaseModel):
    is_completed: bool

# Portfolio Project Schemas
class PortfolioProjectSchema(BaseModel):
    id: str
    job_role_id: str
    title: str
    difficulty: str
    summary: str
    required_technologies: List[str]
    skills_gained: List[str]
    expected_outcome: str
    architecture_overview: Optional[str] = None
    github_starter_url: Optional[str] = None
    status: str = "recommended"

# Interview Schemas
class InterviewQuestionSchema(BaseModel):
    id: str
    question_text: str
    category: str
    difficulty: str
    expected_concepts: List[str] = []
    hints: Optional[str] = None

class InterviewEvaluateRequest(BaseModel):
    user_id: str = "usr-demo-01"
    job_role_id: str
    difficulty: str = "Mid-level"
    question_id: Optional[str] = None
    question_text: str
    category: Optional[str] = "General Technical"
    user_answer: str
    expected_concepts: Optional[List[str]] = []

class InterviewEvaluateResponse(BaseModel):
    session_id: str
    relevance_score: float  # 0-100
    technical_coverage_score: float  # 0-100
    structure_score: float  # 0-100
    overall_answer_score: float  # 0-100
    quality_tier: str  # exemplary, proficient, developing, insufficient
    covered_concepts: List[str]
    missing_concepts: List[str]
    rubric_feedback: str
    improvement_suggestions: List[str]

# Job Application Tracker Schemas
class JobApplicationCreate(BaseModel):
    user_id: str = "usr-demo-01"
    company: str
    job_title: str
    target_role_id: Optional[str] = None
    location: str = "Remote"
    salary_range: Optional[str] = None
    job_description: Optional[str] = None
    status: str = "Applied"
    application_date: str
    interview_date: Optional[str] = None
    outcome_notes: Optional[str] = None
    match_score: Optional[float] = None

class JobApplicationUpdate(BaseModel):
    company: Optional[str] = None
    job_title: Optional[str] = None
    status: Optional[str] = None
    interview_date: Optional[str] = None
    outcome_notes: Optional[str] = None
    match_score: Optional[float] = None

class ApplicationAnalyticsResponse(BaseModel):
    total_applications: int
    applied_count: int
    interview_count: int
    offer_count: int
    rejected_count: int
    wishlist_count: int
    interview_conversion_rate: float  # interview / applied * 100
    offer_conversion_rate: float  # offer / interview * 100
    role_performance: Dict[str, Dict[str, Any]]
    timeline_stats: List[Dict[str, Any]]

# Dashboard Summary Schema
class DashboardSummaryResponse(BaseModel):
    user_name: str
    current_title: str
    target_role_title: str
    resume_match_score: float
    total_skills_detected: int
    missing_skills_count: int
    roadmap_progress_percentage: float
    completed_roadmap_weeks: int
    total_roadmap_weeks: int
    average_interview_score: float
    total_interviews_taken: int
    active_applications_count: int
    total_applications_count: int
    recommended_next_steps: List[Dict[str, str]]

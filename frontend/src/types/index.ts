export interface JobRole {
  id: string;
  title: string;
  category: string;
  description: string;
  average_salary_range?: string;
  demand_level: string;
  is_custom: number;
  skills?: string[];
}

export interface ExtractedSkill {
  name: string;
  category: string;
  confidence: number;
}

export interface ResumeData {
  filename: string;
  file_type: string;
  raw_text: string;
  clean_text: string;
  candidate_name?: string;
  email?: string;
  phone?: string;
  education: Array<{ degree: string; institution?: string; year?: string }>;
  experience: Array<{ role: string; company?: string; duration?: string; description?: string }>;
  projects: Array<{ name: string; technologies?: string; description?: string }>;
  extracted_skills: ExtractedSkill[];
}

export interface SkillGapItem {
  skill_name: string;
  category: string;
  importance: "Essential" | "Important" | "Nice-to-have";
  weight: number;
  recommended_action: string;
}

export interface JobMatchResult {
  job_role_id?: string;
  job_title: string;
  match_score: number;
  skill_gap_percentage: number;
  matched_skills: string[];
  missing_skills: SkillGapItem[];
  suitability_explanation: string;
  category_breakdown: Record<string, { matched: number; total: number }>;
}

export interface RoadmapTask {
  id: string;
  roadmap_id: string;
  week_number: number;
  title: string;
  description?: string;
  topics: string[];
  practice_activities: string[];
  project_milestone?: string;
  recommended_resources: string[];
  is_completed: boolean;
  completed_at?: string | null;
}

export interface LearningRoadmap {
  id: string;
  user_id: string;
  job_role_id: string;
  role_title: string;
  title: string;
  summary: string;
  total_weeks: number;
  progress_percentage: number;
  status: string;
  tasks: RoadmapTask[];
}

export interface PortfolioProject {
  id: string;
  job_role_id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  required_technologies: string[];
  skills_gained: string[];
  expected_outcome: string;
  architecture_overview?: string;
  github_starter_url?: string;
  status: string;
}

export interface InterviewQuestion {
  id: string;
  question_text: string;
  category: string;
  difficulty: string;
  expected_concepts: string[];
  hints?: string;
}

export interface InterviewEvaluation {
  session_id: string;
  relevance_score: number;
  technical_coverage_score: number;
  structure_score: number;
  overall_answer_score: number;
  quality_tier: "exemplary" | "proficient" | "developing" | "insufficient";
  covered_concepts: string[];
  missing_concepts: string[];
  rubric_feedback: string;
  improvement_suggestions: string[];
}

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  job_title: string;
  target_role_id?: string;
  target_role_title?: string;
  location: string;
  salary_range?: string;
  job_description?: string;
  status: "Wishlist" | "Applied" | "Screening" | "Technical Interview" | "Final Round" | "Offer" | "Rejected";
  application_date: string;
  interview_date?: string | null;
  outcome_notes?: string;
  match_score?: number;
}

export interface ApplicationAnalytics {
  total_applications: number;
  applied_count: number;
  interview_count: number;
  offer_count: number;
  rejected_count: number;
  wishlist_count: number;
  interview_conversion_rate: number;
  offer_conversion_rate: number;
  role_performance: Record<string, { total: number; interviews: number; offers: number }>;
  timeline_stats: Array<{ stage: string; count: number }>;
}

export interface DashboardSummary {
  user_name: string;
  current_title: string;
  target_role_title: string;
  resume_match_score: number;
  total_skills_detected: number;
  missing_skills_count: number;
  roadmap_progress_percentage: number;
  completed_roadmap_weeks: number;
  total_roadmap_weeks: number;
  average_interview_score: number;
  total_interviews_taken: number;
  active_applications_count: number;
  total_applications_count: number;
  recommended_next_steps: Array<{
    title: string;
    description: string;
    action_url: string;
    type: string;
  }>;
}

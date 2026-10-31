-- CareerPivot AI Seed Data

-- 1. Insert Target Job Roles
INSERT OR IGNORE INTO job_roles (id, title, category, description, average_salary_range, demand_level, is_custom) VALUES
('role-frontend', 'Frontend Developer', 'Software Engineering', 'Builds dynamic, responsive, and accessible user interfaces and web applications using modern JavaScript/TypeScript frameworks.', '$85,000 - $130,000', 'Very High', 0),
('role-backend', 'Backend Developer', 'Software Engineering', 'Architects scalable microservices, robust REST/GraphQL APIs, databases, and server-side business logic.', '$95,000 - $145,000', 'Very High', 0),
('role-fullstack', 'Full Stack Developer', 'Software Engineering', 'Masters end-to-end web engineering, bridging elegant frontend experiences with resilient backend services and data layers.', '$100,000 - $155,000', 'Very High', 0),
('role-python-dev', 'Python Developer', 'Software Engineering', 'Engineers backend services, automation scripts, data integration pipelines, and web APIs using the Python ecosystem.', '$90,000 - $135,000', 'High', 0),
('role-data-analyst', 'Data Analyst', 'Data & Analytics', 'Transforms raw data into actionable business intelligence through SQL, statistical modeling, and interactive dashboards.', '$75,000 - $115,000', 'High', 0),
('role-data-scientist', 'Data Scientist', 'Data & AI', 'Applies statistical rigor, machine learning, predictive modeling, and exploratory data analysis to solve complex challenges.', '$110,000 - $165,000', 'Very High', 0),
('role-ml-engineer', 'Machine Learning Engineer', 'Data & AI', 'Designs, trains, tests, and deploys production-grade ML architectures, LLM pipelines, and automated inference services.', '$125,000 - $185,000', 'Very High', 0),
('role-cybersecurity', 'Cybersecurity Analyst', 'Security & Infrastructure', 'Protects systems, networks, and data against cyber threats, conducts vulnerability assessments, and enforces compliance.', '$90,000 - $140,000', 'Very High', 0),
('role-cloud-engineer', 'Cloud Engineer', 'Cloud & DevOps', 'Provisions, automates, and optimizes cloud infrastructure (AWS/GCP/Azure) with Infrastructure as Code and CI/CD pipelines.', '$105,000 - $160,000', 'Very High', 0);

-- 2. Insert Skills Master Taxonomy
INSERT OR IGNORE INTO skills (id, name, category, description) VALUES
-- Frontend
('sk-react', 'React', 'frontend', 'Component-based UI library with hooks, virtual DOM, and modern state management.'),
('sk-nextjs', 'Next.js', 'frontend', 'Full-stack React framework supporting SSR, SSG, server components, and App Router.'),
('sk-typescript', 'TypeScript', 'programming', 'Typed superset of JavaScript providing static typing and enterprise scalability.'),
('sk-javascript', 'JavaScript', 'programming', 'Core web programming language for client and server runtime execution.'),
('sk-tailwind', 'Tailwind CSS', 'frontend', 'Utility-first CSS framework for rapid and modern UI styling.'),
('sk-html-css', 'HTML5 & CSS3', 'frontend', 'Semantic markup and responsive layout styling (Flexbox/Grid).'),
('sk-vue', 'Vue.js', 'frontend', 'Progressive JavaScript framework for building user interfaces.'),

-- Backend & Programming
('sk-python', 'Python', 'programming', 'Versatile high-level programming language for web, data, and ML.'),
('sk-fastapi', 'FastAPI', 'backend', 'High-performance Python web framework for building modern REST APIs.'),
('sk-nodejs', 'Node.js', 'backend', 'Asynchronous event-driven JavaScript server runtime environment.'),
('sk-express', 'Express.js', 'backend', 'Fast, unopinionated, minimalist web framework for Node.js.'),
('sk-django', 'Django', 'backend', 'High-level Python web framework encouraging rapid development and clean design.'),
('sk-rest-api', 'RESTful APIs', 'backend', 'Architectural style for designing networked applications and microservices.'),
('sk-graphql', 'GraphQL', 'backend', 'Query language for APIs offering declarative data fetching.'),

-- Database
('sk-sql', 'SQL', 'database', 'Structured Query Language for querying and managing relational databases.'),
('sk-postgresql', 'PostgreSQL', 'database', 'Powerful open-source object-relational database system.'),
('sk-mongodb', 'MongoDB', 'database', 'Document-oriented NoSQL database for flexible data structures.'),
('sk-redis', 'Redis', 'database', 'In-memory data structure store used as a cache and message broker.'),

-- Cloud & DevOps
('sk-docker', 'Docker', 'cloud', 'Containerization platform for packaging applications and dependencies.'),
('sk-kubernetes', 'Kubernetes', 'cloud', 'Automated container orchestration, scaling, and deployment platform.'),
('sk-aws', 'AWS', 'cloud', 'Comprehensive Amazon Web Services cloud platform (EC2, S3, Lambda, RDS).'),
('sk-gcp', 'Google Cloud Platform', 'cloud', 'Suite of cloud computing services by Google (GKE, Cloud Run, BigQuery).'),
('sk-cicd', 'CI/CD Pipelines', 'cloud', 'Automated testing and continuous integration/deployment (GitHub Actions, GitLab).'),
('sk-terraform', 'Terraform', 'cloud', 'Infrastructure as Code software tool for provisioning cloud resources.'),

-- Data & ML
('sk-pandas', 'Pandas & NumPy', 'data_ml', 'Python libraries for data manipulation, cleaning, and numeric computing.'),
('sk-scikit-learn', 'Scikit-Learn', 'data_ml', 'Machine learning library for classification, regression, and clustering.'),
('sk-deep-learning', 'PyTorch / TensorFlow', 'data_ml', 'Deep learning frameworks for neural networks, computer vision, and NLP.'),
('sk-nlp', 'NLP (Natural Language Processing)', 'data_ml', 'Techniques for processing, tokenizing, and understanding textual data.'),
('sk-data-viz', 'Data Visualization (Tableau/PowerBI/Plotly)', 'data_ml', 'Creating intuitive visual analytics, dashboards, and reports.'),

-- Security
('sk-network-sec', 'Network Security', 'security', 'Firewalls, VPNs, IDS/IPS, protocol analysis, and threat hunting.'),
('sk-siem', 'SIEM & SOC Operations', 'security', 'Security information and event management (Splunk, Sentinel).'),
('sk-penetration-testing', 'Vulnerability Assessment', 'security', 'Identifying and mitigating security vulnerabilities and exposures.'),

-- Soft Skills
('sk-problem-solving', 'Problem Solving & Algorithmic Thinking', 'soft_skills', 'Structured analytical problem solving, data structures, and algorithms.'),
('sk-communication', 'Technical Communication', 'soft_skills', 'Articulating complex technical concepts to non-technical stakeholders.'),
('sk-agile', 'Agile & Scrum Methodologies', 'soft_skills', 'Iterative software delivery, sprint planning, and retrospective collaboration.');

-- 3. Link Skill Requirements to Job Roles
-- Frontend Developer Requirements
INSERT OR IGNORE INTO skill_requirements (id, job_role_id, skill_id, importance, weight, minimum_proficiency) VALUES
('req-fe-1', 'role-frontend', 'sk-javascript', 'Essential', 1.0, 'Advanced'),
('req-fe-2', 'role-frontend', 'sk-typescript', 'Essential', 1.0, 'Intermediate'),
('req-fe-3', 'role-frontend', 'sk-react', 'Essential', 1.0, 'Advanced'),
('req-fe-4', 'role-frontend', 'sk-nextjs', 'Important', 0.8, 'Intermediate'),
('req-fe-5', 'role-frontend', 'sk-tailwind', 'Important', 0.8, 'Intermediate'),
('req-fe-6', 'role-frontend', 'sk-html-css', 'Essential', 1.0, 'Advanced'),
('req-fe-7', 'role-frontend', 'sk-rest-api', 'Important', 0.8, 'Intermediate'),
('req-fe-8', 'role-frontend', 'sk-communication', 'Important', 0.7, 'Intermediate');

-- Backend Developer Requirements
INSERT OR IGNORE INTO skill_requirements (id, job_role_id, skill_id, importance, weight, minimum_proficiency) VALUES
('req-be-1', 'role-backend', 'sk-python', 'Essential', 1.0, 'Advanced'),
('req-be-2', 'role-backend', 'sk-fastapi', 'Essential', 1.0, 'Intermediate'),
('req-be-3', 'role-backend', 'sk-sql', 'Essential', 1.0, 'Advanced'),
('req-be-4', 'role-backend', 'sk-postgresql', 'Essential', 1.0, 'Intermediate'),
('req-be-5', 'role-backend', 'sk-docker', 'Important', 0.85, 'Intermediate'),
('req-be-6', 'role-backend', 'sk-redis', 'Important', 0.8, 'Intermediate'),
('req-be-7', 'role-backend', 'sk-rest-api', 'Essential', 1.0, 'Advanced'),
('req-be-8', 'role-backend', 'sk-aws', 'Nice-to-have', 0.6, 'Beginner');

-- Full Stack Developer Requirements
INSERT OR IGNORE INTO skill_requirements (id, job_role_id, skill_id, importance, weight, minimum_proficiency) VALUES
('req-fs-1', 'role-fullstack', 'sk-typescript', 'Essential', 1.0, 'Intermediate'),
('req-fs-2', 'role-fullstack', 'sk-react', 'Essential', 1.0, 'Advanced'),
('req-fs-3', 'role-fullstack', 'sk-nodejs', 'Essential', 1.0, 'Intermediate'),
('req-fs-4', 'role-fullstack', 'sk-postgresql', 'Essential', 1.0, 'Intermediate'),
('req-fs-5', 'role-fullstack', 'sk-docker', 'Important', 0.8, 'Intermediate'),
('req-fs-6', 'role-fullstack', 'sk-rest-api', 'Essential', 1.0, 'Advanced'),
('req-fs-7', 'role-fullstack', 'sk-nextjs', 'Important', 0.85, 'Intermediate'),
('req-fs-8', 'role-fullstack', 'sk-tailwind', 'Important', 0.75, 'Intermediate');

-- Data Scientist Requirements
INSERT OR IGNORE INTO skill_requirements (id, job_role_id, skill_id, importance, weight, minimum_proficiency) VALUES
('req-ds-1', 'role-data-scientist', 'sk-python', 'Essential', 1.0, 'Advanced'),
('req-ds-2', 'role-data-scientist', 'sk-pandas', 'Essential', 1.0, 'Advanced'),
('req-ds-3', 'role-data-scientist', 'sk-scikit-learn', 'Essential', 1.0, 'Advanced'),
('req-ds-4', 'role-data-scientist', 'sk-sql', 'Essential', 1.0, 'Intermediate'),
('req-ds-5', 'role-data-scientist', 'sk-data-viz', 'Important', 0.8, 'Intermediate'),
('req-ds-6', 'role-data-scientist', 'sk-deep-learning', 'Important', 0.85, 'Intermediate'),
('req-ds-7', 'role-data-scientist', 'sk-problem-solving', 'Essential', 1.0, 'Advanced');

-- ML Engineer Requirements
INSERT OR IGNORE INTO skill_requirements (id, job_role_id, skill_id, importance, weight, minimum_proficiency) VALUES
('req-ml-1', 'role-ml-engineer', 'sk-python', 'Essential', 1.0, 'Advanced'),
('req-ml-2', 'role-ml-engineer', 'sk-scikit-learn', 'Essential', 1.0, 'Advanced'),
('req-ml-3', 'role-ml-engineer', 'sk-deep-learning', 'Essential', 1.0, 'Advanced'),
('req-ml-4', 'role-ml-engineer', 'sk-docker', 'Essential', 1.0, 'Intermediate'),
('req-ml-5', 'role-ml-engineer', 'sk-fastapi', 'Important', 0.85, 'Intermediate'),
('req-ml-6', 'role-ml-engineer', 'sk-cicd', 'Important', 0.8, 'Intermediate'),
('req-ml-7', 'role-ml-engineer', 'sk-nlp', 'Important', 0.8, 'Intermediate');

-- Cloud Engineer Requirements
INSERT OR IGNORE INTO skill_requirements (id, job_role_id, skill_id, importance, weight, minimum_proficiency) VALUES
('req-cl-1', 'role-cloud-engineer', 'sk-aws', 'Essential', 1.0, 'Advanced'),
('req-cl-2', 'role-cloud-engineer', 'sk-docker', 'Essential', 1.0, 'Advanced'),
('req-cl-3', 'role-cloud-engineer', 'sk-kubernetes', 'Essential', 1.0, 'Intermediate'),
('req-cl-4', 'role-cloud-engineer', 'sk-terraform', 'Essential', 1.0, 'Intermediate'),
('req-cl-5', 'role-cloud-engineer', 'sk-cicd', 'Essential', 1.0, 'Intermediate'),
('req-cl-6', 'role-cloud-engineer', 'sk-python', 'Important', 0.8, 'Intermediate');

-- 4. Portfolio Projects Catalog
INSERT OR IGNORE INTO portfolio_projects (id, job_role_id, title, difficulty, summary, required_technologies_json, skills_gained_json, expected_outcome, architecture_overview) VALUES
('proj-1', 'role-frontend', 'NextGen Analytics SaaS Dashboard', 'Intermediate', 'Build a high-performance responsive metrics dashboard with real-time charting, customizable widgets, dark/light theme, and role-based views.', '["Next.js", "TypeScript", "Tailwind CSS", "Recharts"]', '["Component Architecture", "Data Visualization", "State Management", "Performance Optimization"]', 'Production-ready web application hosted on Vercel with Lighthouse score > 95.', 'Next.js App Router frontend consuming REST endpoints with optimistic UI updates and responsive grid layout.'),
('proj-2', 'role-backend', 'Scalable Event-Driven Payment Microservice', 'Advanced', 'Implement a resilient payment and invoice processing microservice with idempotency keys, rate limiting, and webhook dispatching.', '["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"]', '["Asynchronous Programming", "Database Transactions", "Distributed Caching", "API Security"]', 'Containerized API handling 1,500 requests/sec with automated test coverage exceeding 90%.', 'FastAPI async handlers with Celery background workers, Redis pub/sub, and PostgreSQL ACID transactions.'),
('proj-3', 'role-data-scientist', 'Customer Churn Prediction & Explainability Engine', 'Intermediate', 'Train predictive classification models on telecom customer data with SHAP value interpretability and an interactive Streamlit inference tool.', '["Python", "Pandas", "Scikit-Learn", "SHAP", "Plotly"]', '["Feature Engineering", "Model Evaluation (ROC-AUC)", "Model Interpretability", "Business KPI Mapping"]', 'Interactive web model predicting churn probability with actionable feature importance for retention teams.', 'Data pipeline extracting behavioral features, training XGBoost/RandomForest, serving SHAP waterfall explanations.'),
('proj-4', 'role-ml-engineer', 'End-to-End LLM RAG Document Intelligence Platform', 'Advanced', 'Build a production Retrieval-Augmented Generation system with hybrid vector search, reranking, and citation tracking.', '["Python", "FastAPI", "Docker", "PyTorch", "NLP"]', '["Vector Embeddings", "RAG Pipeline Architecture", "Latency Optimization", "Model Monitoring"]', 'Deployed containerized API serving document Q&A with sub-500ms retrieval latency.', 'Chunking and embedding pipeline indexing to vector store with FastAPI query orchestrator.'),
('proj-5', 'role-cloud-engineer', 'Multi-Region Kubernetes Cloud Infrastructure with Terraform', 'Advanced', 'Provision an automated GitOps deployment pipeline across multi-zone EKS clusters with monitoring and automated failover.', '["AWS", "Terraform", "Kubernetes", "Docker", "CI/CD Pipelines"]', '["Infrastructure as Code", "Cluster Hardening", "Helm Packaging", "Observability (Prometheus/Grafana)"]', 'Zero-downtime automated deployment pipeline verifiable via GitHub Actions.', 'Terraform modules declaring VPC, subnets, IAM roles, and EKS managed node groups with ArgoCD.');

-- 5. Default User Profile
INSERT OR IGNORE INTO users (id, name, email, current_title, years_of_experience, target_role_id, bio) VALUES
('usr-demo-01', 'Alex Rivera', 'alex.rivera@example.com', 'Junior Software Developer', 1.5, 'role-fullstack', 'Passionate junior developer transitioning into full-stack web engineering with a focus on modern TypeScript, React, and scalable APIs.');

-- 6. Sample Initial Resume Data
INSERT OR IGNORE INTO resumes (id, user_id, filename, file_type, raw_text, clean_text, education_json, experience_json, projects_json, extracted_skills_json) VALUES
('res-demo-01', 'usr-demo-01', 'alex_rivera_resume.pdf', 'pdf',
'Alex Rivera\nSoftware Developer\nEmail: alex.rivera@example.com | GitHub: github.com/alexrivera\n\nSUMMARY\nMotivated software developer with 1.5 years experience in building web interfaces and backend scripts. Skilled in JavaScript, React, HTML, CSS, and basic Node.js.\n\nEXPERIENCE\nJunior Web Developer at TechNova (2024 - Present)\n- Developed responsive landing pages using React and Tailwind CSS.\n- Integrated RESTful APIs with frontend client components.\n- Collaborated with QA team to fix cross-browser compatibility issues.\n\nEDUCATION\nB.S. in Computer Science - State University (2020 - 2024)\n\nSKILLS\nJavaScript, React, HTML5, CSS3, Tailwind CSS, Git, Basic Node.js, SQL, Problem Solving',
'Alex Rivera Software Developer JavaScript React HTML CSS Node.js Junior Web Developer TechNova responsive landing pages Tailwind CSS RESTful APIs B.S. Computer Science State University Git SQL Problem Solving',
'[{"degree": "B.S. in Computer Science", "institution": "State University", "year": "2020 - 2024"}]',
'[{"role": "Junior Web Developer", "company": "TechNova", "duration": "2024 - Present", "description": "Developed responsive landing pages using React and Tailwind CSS, integrated RESTful APIs."}]',
'[{"name": "E-Commerce Catalog", "technologies": "React, Tailwind, Node.js", "description": "Built dynamic filtering and product search."}]',
'["JavaScript", "React", "HTML5 & CSS3", "Tailwind CSS", "RESTful APIs", "SQL", "Problem Solving & Algorithmic Thinking"]'
);

-- 7. Sample Skill Gap Record
INSERT OR IGNORE INTO skill_gaps (id, user_id, resume_id, job_role_id, match_score, matched_skills_json, missing_skills_json, suitability_explanation) VALUES
('gap-demo-01', 'usr-demo-01', 'res-demo-01', 'role-fullstack', 68.5,
'["JavaScript", "React", "Tailwind CSS", "RESTful APIs", "Problem Solving & Algorithmic Thinking"]',
'["TypeScript", "Node.js", "PostgreSQL", "Docker", "Next.js"]',
'You have a solid frontend foundation in React and modern CSS along with API integration experience. To reach full readiness for a Full Stack Developer role, prioritize mastering TypeScript for type safety, deep Node.js backend development, relational database modeling with PostgreSQL, and containerization with Docker.'
);

-- 8. Sample Learning Roadmap
INSERT OR IGNORE INTO learning_roadmaps (id, user_id, job_role_id, title, summary, total_weeks, progress_percentage, status) VALUES
('rdm-demo-01', 'usr-demo-01', 'role-fullstack', '8-Week Full Stack Engineer Transition Roadmap', 'Structured weekly curriculum bridging React frontend skills into enterprise TypeScript, Node.js microservices, PostgreSQL data modeling, and Docker deployment.', 8, 37.5, 'in_progress');

INSERT OR IGNORE INTO roadmap_tasks (id, roadmap_id, week_number, title, description, topics_json, practice_activities_json, project_milestone, recommended_resources_json, is_completed, completed_at) VALUES
('task-w1', 'rdm-demo-01', 1, 'TypeScript Deep Dive for Frontend & Backend', 'Master static typing, generics, interfaces, union types, and TS compiler configuration in modern web apps.', '["TypeScript Generics", "Strict Type Checking", "Utility Types (Pick, Omit, Partial)", "TS with React Components"]', '["Refactor an existing React app to TypeScript with zero any types", "Implement custom generic hook for API requests"]', 'Fully typed client repository', '["TypeScript Official Handbook", "Total TypeScript by Matt Pocock"]', 1, '2026-10-15 10:00:00'),
('task-w2', 'rdm-demo-01', 2, 'Next.js 14 App Router & Server Components', 'Understand Server vs Client components, Server Actions, streaming SSR, and SEO-optimized dynamic routing.', '["RSC (React Server Components)", "Server Actions & Mutations", "Dynamic Routing & Layouts", "Parallel & Intercepting Routes"]', '["Build an interactive server-rendered blog with Server Actions", "Implement route caching and revalidation strategies"]', 'Next.js App Router Project', '["Next.js Documentation", "Vercel Academy"]', 1, '2026-10-22 14:30:00'),
('task-w3', 'rdm-demo-01', 3, 'Relational Database Modeling with PostgreSQL', 'Schema design, normalization, foreign keys, indexing, transactions, and ORM integration.', '["Relational Modeling (1-N, N-N)", "Indexes (B-Tree, Hash, GIN)", "ACID Transactions", "Prisma/Drizzle ORM"]', '["Write complex multi-table JOINs and aggregations", "Profile query execution plan using EXPLAIN ANALYZE"]', 'E-commerce Database Schema & Migrations', '["PostgreSQL Tutorial", "Use The Index, Luke"]', 1, '2026-10-29 18:00:00'),
('task-w4', 'rdm-demo-01', 4, 'Advanced Backend APIs & Authentication', 'Architect production-grade REST APIs, JWT authentication, refresh tokens, role-based access control, and rate limiting.', '["JWT & HttpOnly Cookie Auth", "Role-Based Access Control (RBAC)", "Input Validation & Sanitization", "API Rate Limiting"]', '["Build an auth microservice with access and refresh tokens", "Implement middleware for authorization"]', 'Secure Authentication Microservice', '["OWASP API Security Top 10", "FastAPI / Express Security Best Practices"]', 0, NULL),
('task-w5', 'rdm-demo-01', 5, 'Docker Containerization & Multi-Stage Builds', 'Containerize full stack applications with optimized Dockerfiles, docker-compose orchestration, and volume persistence.', '["Docker Engine Concepts", "Multi-stage Dockerfile optimization", "Docker Compose for local dev", "Environment management"]', '["Write multi-stage Dockerfile reducing image size under 150MB", "Run frontend + backend + postgres on compose network"]', 'Containerized Local Full Stack Stack', '["Docker Official Getting Started Guide", "Bret Fisher Docker Mastery"]', 0, NULL),
('task-w6', 'rdm-demo-01', 6, 'Caching, Redis & Message Queues', 'Improve latency and handle high throughput with in-memory caching and asynchronous job processing.', '["Redis Key-Value & Sets", "Cache-Aside & Write-Through Patterns", "Session Storage", "Background Task Queues"]', '["Implement cache layer with TTL invalidation", "Build an async email dispatch worker"]', 'High-Throughput Caching Layer', '["Redis University", "Designing Data-Intensive Applications"]', 0, NULL),
('task-w7', 'rdm-demo-01', 7, 'Automated CI/CD & Cloud Deployment', 'Deploy full-stack services with automated testing, linting, GitHub Actions CI/CD, and cloud hosting.', '["GitHub Actions Workflows", "Automated Unit & Integration Tests", "Cloud Deployment (AWS/Render/Vercel)", "Zero-downtime deployment"]', '["Set up pipeline that runs lint + tests on PR", "Automate staging deploy on git push"]', 'Live CI/CD Deployment Pipeline', '["GitHub Actions Docs", "The Twelve-Factor App"]', 0, NULL),
('task-w8', 'rdm-demo-01', 8, 'Full Capstone Project & System Design', 'Consolidate skills into a portfolio-worthy full-stack product with end-to-end documentation, architecture diagram, and live demo.', '["System Architecture Planning", "API Documentation (Swagger/OpenAPI)", "Performance Benchmarking", "Interview Portfolio Preparation"]', '["Conduct end-to-end load test using k6", "Record 3-minute video walkthrough of technical architecture"]', 'Production Capstone Live Demo', '["System Design Primer", "Full Stack Open"]', 0, NULL);

-- 9. Sample Job Applications
INSERT OR IGNORE INTO job_applications (id, user_id, company, job_title, target_role_id, location, salary_range, job_description, status, application_date, interview_date, outcome_notes, match_score) VALUES
('app-1', 'usr-demo-01', 'Stripe', 'Full Stack Software Engineer', 'role-fullstack', 'Remote (US)', '$135,000 - $165,000', 'Building merchant dashboard experiences and robust billing infrastructure with React, TypeScript, and microservices.', 'Technical Interview', '2026-10-10', '2026-11-04', 'Passed phone screen. Preparing for system design and live coding round.', 82.0),
('app-2', 'usr-demo-01', 'Vercel', 'Frontend Platform Engineer', 'role-frontend', 'Remote', '$120,000 - $150,000', 'Developing Next.js edge capabilities and rich developer portal user interfaces.', 'Final Round', '2026-10-05', '2026-11-02', 'Completed take-home challenge with high praise on component architecture.', 91.5),
('app-3', 'usr-demo-01', 'Datadog', 'Backend Systems Engineer', 'role-backend', 'New York, NY', '$130,000 - $160,000', 'High-throughput telemetry ingestion pipelines and distributed API services.', 'Screening', '2026-10-18', '2026-10-30', 'Recruiter call scheduled for next Tuesday.', 64.0),
('app-4', 'usr-demo-01', 'Linear', 'Full Stack Product Engineer', 'role-fullstack', 'Remote', '$140,000 - $170,000', 'Crafting blazing fast desktop and web collaboration tools with sync engines and React.', 'Applied', '2026-10-25', NULL, 'Application submitted with customized portfolio project link.', 78.0),
('app-5', 'usr-demo-01', 'Shopify', 'Software Developer II', 'role-fullstack', 'Remote (Canada/US)', '$125,000 - $155,000', 'Building merchant storefront extensions and scalable checkout workflows.', 'Wishlist', '2026-10-28', NULL, 'Reviewing open listings and networking with engineering managers.', 75.0);

-- 10. Sample Interview Sessions & Answers
INSERT OR IGNORE INTO interview_sessions (id, user_id, job_role_id, difficulty, overall_score, feedback_summary) VALUES
('sess-demo-01', 'usr-demo-01', 'role-fullstack', 'Mid-level', 84.5, 'Strong conceptual grasp of React virtual DOM, state lifting, and RESTful status codes. Demonstrates good communication. Needs slight improvement in explaining database indexing nuances and transaction isolation levels.');

INSERT OR IGNORE INTO interview_answers (id, session_id, question_text, category, user_answer, relevance_score, technical_coverage_score, structure_score, overall_answer_score, covered_concepts_json, missing_concepts_json, improvement_suggestions) VALUES
('ans-1', 'sess-demo-01', 'How does React Virtual DOM reconciliation work, and what role do keys play in list rendering?', 'Frontend Architecture',
'React keeps an in-memory representation of the UI called the Virtual DOM. When component state changes, React creates a new virtual DOM tree and runs a diffing algorithm called reconciliation to compare it with the previous snapshot. It computes the minimum set of mutations needed on the actual real DOM. Keys are crucial in arrays because they give React a stable identifier across renders, preventing unnecessary re-mounting of unchanged items and maintaining state correctly.',
92.0, 88.0, 90.0, 90.0, '["Virtual DOM", "Reconciliation Diffing Algorithm", "Real DOM Mutations", "Stable Array Keys", "Component State Lifecycle"]', '["Fiber Architecture Details", "O(n) Heuristic Assumptions"]', '["Excellent structured explanation! You clearly outlined the problem, the mechanism, and why keys matter. Mentioning React Fiber or time-slicing would elevate this to Senior level."]');

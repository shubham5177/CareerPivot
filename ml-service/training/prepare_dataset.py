"""
CareerPivot AI - Dataset Preparation Pipeline
Generates synthetic and benchmark datasets for reproducible ML model training and evaluation:
1. Skill Categorization Dataset (skills_dataset.csv)
2. Job Matching Relevance Benchmark (job_matching_benchmark.json)
3. Mock Interview Evaluation Dataset (interview_evaluation_dataset.csv)
"""

import json
import os
import pandas as pd
import numpy as np

DATASETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "datasets"))
os.makedirs(DATASETS_DIR, exist_ok=True)

def generate_skills_dataset():
    """
    Creates a comprehensive dataset of skills across 8 core categories:
    frontend, backend, database, cloud, programming, soft_skills, data_ml, security
    """
    raw_data = [
        # Frontend
        ("React", "frontend"), ("React.js", "frontend"), ("Next.js", "frontend"), ("Vue.js", "frontend"),
        ("Angular", "frontend"), ("Svelte", "frontend"), ("Tailwind CSS", "frontend"), ("Bootstrap", "frontend"),
        ("HTML5 semantic layout", "frontend"), ("CSS3 animations and Grid", "frontend"), ("Redux Toolkit", "frontend"),
        ("Zustand state management", "frontend"), ("Web Accessibility WCAG", "frontend"), ("Responsive Web Design", "frontend"),
        ("Vite bundler", "frontend"), ("Webpack configuration", "frontend"), ("Sass SCSS preprocessing", "frontend"),
        ("DOM manipulation", "frontend"), ("Figma to code translation", "frontend"), ("Single Page Applications SPA", "frontend"),
        ("React Native", "frontend"), ("Storybook UI components", "frontend"), ("Frontend Performance Optimization", "frontend"),
        ("Shadow DOM", "frontend"), ("Client-side routing", "frontend"), ("Progressive Web Apps PWA", "frontend"),

        # Backend
        ("FastAPI", "backend"), ("Node.js", "backend"), ("Express.js", "backend"), ("Django", "backend"),
        ("Flask microframework", "backend"), ("Spring Boot", "backend"), ("ASP.NET Core", "backend"),
        ("RESTful API design", "backend"), ("GraphQL query schemas", "backend"), ("gRPC protocols", "backend"),
        ("Microservices architecture", "backend"), ("Celery distributed task queue", "backend"),
        ("Serverless functions", "backend"), ("WebSockets real-time communication", "backend"),
        ("API Gateway rate limiting", "backend"), ("OAuth2 authentication", "backend"), ("JWT tokens", "backend"),
        ("Backend caching strategies", "backend"), ("Message queues RabbitMQ", "backend"), ("Kafka event streams", "backend"),
        ("Middleware pipeline", "backend"), ("Asynchronous I/O asyncio", "backend"), ("Event-driven architecture", "backend"),

        # Database
        ("SQL queries", "database"), ("PostgreSQL relational database", "database"), ("MySQL", "database"),
        ("MongoDB document store", "database"), ("Redis in-memory caching", "database"), ("SQLite database", "database"),
        ("Database indexing B-tree", "database"), ("ACID transactions", "database"), ("Cassandra NoSQL", "database"),
        ("DynamoDB serverless database", "database"), ("Prisma ORM", "database"), ("SQLAlchemy ORM", "database"),
        ("Database schema normalization", "database"), ("Query optimization EXPLAIN ANALYZE", "database"),
        ("Data warehousing Snowflake", "database"), ("Elasticsearch full-text search", "database"),
        ("Neo4j graph database", "database"), ("Database migrations Alembic", "database"), ("Database connection pooling", "database"),

        # Cloud & DevOps
        ("Docker containerization", "cloud"), ("Kubernetes cluster orchestration", "cloud"), ("AWS EC2 and S3", "cloud"),
        ("AWS Lambda serverless", "cloud"), ("Google Cloud Platform GCP", "cloud"), ("Microsoft Azure", "cloud"),
        ("Terraform Infrastructure as Code", "cloud"), ("CI/CD GitHub Actions", "cloud"), ("GitLab CI", "cloud"),
        ("Helm charts Kubernetes", "cloud"), ("Prometheus and Grafana monitoring", "cloud"), ("Nginx reverse proxy", "cloud"),
        ("CloudFormation templates", "cloud"), ("Container registry ECR", "cloud"), ("Linux bash shell scripting", "cloud"),
        ("Site Reliability Engineering SRE", "cloud"), ("Load balancer routing", "cloud"), ("ArgoCD GitOps", "cloud"),

        # Programming Languages
        ("Python programming", "programming"), ("TypeScript static typing", "programming"), ("JavaScript ES6+", "programming"),
        ("Java object oriented", "programming"), ("Go Golang", "programming"), ("Rust memory safety", "programming"),
        ("C++ systems programming", "programming"), ("C# language", "programming"), ("PHP modern", "programming"),
        ("Ruby on Rails", "programming"), ("Kotlin Android", "programming"), ("Swift iOS", "programming"),
        ("Data structures and algorithms", "programming"), ("Object-oriented design patterns", "programming"),
        ("Functional programming concepts", "programming"), ("Concurrency and multithreading", "programming"),

        # Data & ML
        ("Pandas dataframe manipulation", "data_ml"), ("NumPy array computation", "data_ml"),
        ("Scikit-Learn machine learning", "data_ml"), ("PyTorch deep neural networks", "data_ml"),
        ("TensorFlow Keras", "data_ml"), ("Natural Language Processing NLP", "data_ml"),
        ("Computer Vision OpenCV", "data_ml"), ("Exploratory Data Analysis EDA", "data_ml"),
        ("Feature Engineering", "data_ml"), ("Supervised classification models", "data_ml"),
        ("Unsupervised clustering K-Means", "data_ml"), ("Large Language Models LLMs", "data_ml"),
        ("RAG Retrieval Augmented Generation", "data_ml"), ("Model evaluation metrics ROC AUC", "data_ml"),
        ("Matplotlib and Seaborn plotting", "data_ml"), ("Tableau dashboarding", "data_ml"),
        ("PowerBI reports", "data_ml"), ("Vector databases Pinecone Chroma", "data_ml"),

        # Security
        ("Network Security firewalls", "security"), ("Vulnerability scanning Nessus", "security"),
        ("Penetration testing Kali Linux", "security"), ("OWASP Top 10 vulnerabilities", "security"),
        ("SIEM security monitoring Splunk", "security"), ("Cryptography public key PKI", "security"),
        ("Incident Response SOC", "security"), ("Identity and Access Management IAM", "security"),
        ("Ethical Hacking", "security"), ("Zero Trust architecture", "security"),
        ("Threat modeling and risk assessment", "security"), ("SSL TLS certificates", "security"),

        # Soft Skills
        ("Technical leadership and mentoring", "soft_skills"), ("Agile Scrum sprint planning", "soft_skills"),
        ("Cross-functional stakeholder collaboration", "soft_skills"), ("Analytical problem solving", "soft_skills"),
        ("Written and verbal communication", "soft_skills"), ("Time management and prioritization", "soft_skills"),
        ("Team code review best practices", "soft_skills"), ("Conflict resolution", "soft_skills"),
        ("Product requirement documentation PRD", "soft_skills"), ("Critical thinking and empathy", "soft_skills"),
        ("Continuous learning and adaptability", "soft_skills"), ("Client presentation skills", "soft_skills"),
    ]

    # Synthesize phrase variants to expand sample diversity
    expanded_data = []
    prefixes = ["Proficient in", "Experienced with", "Deep understanding of", "Hands-on experience in", "Working knowledge of", "Skilled in"]
    for skill_text, category in raw_data:
        expanded_data.append({"text": skill_text, "category": category})
        # Add prefixed variations
        for p in prefixes[:2]:
            expanded_data.append({"text": f"{p} {skill_text.lower()}", "category": category})

    df = pd.DataFrame(expanded_data)
    file_path = os.path.join(DATASETS_DIR, "skills_dataset.csv")
    df.to_csv(file_path, index=False)
    print(f"[Dataset] Skills dataset created with {len(df)} samples at {file_path}")
    return df

def generate_job_matching_benchmark():
    """
    Creates a benchmark dataset pairing resume skill profiles with job descriptions
    and expected relevance labels (High=1.0, Moderate=0.6, Low=0.2, Irrelevant=0.0)
    for model evaluation.
    """
    benchmark = [
        {
            "id": "match-01",
            "resume_skills": ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "REST APIs", "Git"],
            "job_title": "Frontend Developer",
            "job_description": "We are seeking a Frontend Engineer proficient in React, TypeScript, Next.js, and modern CSS frameworks like Tailwind. Must be experienced with consuming RESTful APIs and writing testable clean UI components.",
            "required_skills": ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs"],
            "expected_relevance": 0.88,
            "relevance_tier": "High"
        },
        {
            "id": "match-02",
            "resume_skills": ["Python", "FastAPI", "PostgreSQL", "SQL", "Docker", "Redis", "REST APIs", "Git"],
            "job_title": "Backend Developer",
            "job_description": "Looking for a Backend Developer to build scalable asynchronous services with Python, FastAPI or Django, PostgreSQL databases, and Redis caching. Experience with Docker and microservices required.",
            "required_skills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "REST APIs"],
            "expected_relevance": 0.94,
            "relevance_tier": "High"
        },
        {
            "id": "match-03",
            "resume_skills": ["HTML5", "CSS3", "Basic JavaScript", "WordPress", "Photoshop"],
            "job_title": "Full Stack Developer",
            "job_description": "Seeking Full Stack Developer to build enterprise web applications with TypeScript, React, Node.js, PostgreSQL, Docker, and AWS cloud deployment.",
            "required_skills": ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
            "expected_relevance": 0.28,
            "relevance_tier": "Low"
        },
        {
            "id": "match-04",
            "resume_skills": ["Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "Data Visualization", "Matplotlib"],
            "job_title": "Data Scientist",
            "job_description": "Data Scientist role requiring strong statistical analysis, exploratory data analysis using Pandas and NumPy, predictive modeling with Scikit-Learn, and SQL database querying.",
            "required_skills": ["Python", "Pandas", "Scikit-Learn", "SQL", "Statistics"],
            "expected_relevance": 0.90,
            "relevance_tier": "High"
        },
        {
            "id": "match-05",
            "resume_skills": ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD", "Linux", "Bash", "Python"],
            "job_title": "Cloud Engineer",
            "job_description": "Cloud Engineer wanted to design and maintain automated infrastructure on AWS using Terraform and Docker. Kubernetes container orchestration and CI/CD automation essential.",
            "required_skills": ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD Pipelines"],
            "expected_relevance": 0.95,
            "relevance_tier": "High"
        },
        {
            "id": "match-06",
            "resume_skills": ["React", "CSS", "HTML", "Figma"],
            "job_title": "Cybersecurity Analyst",
            "job_description": "Cybersecurity Analyst to monitor security events, conduct vulnerability assessments with Nessus, configure SIEM tooling (Splunk), and enforce firewall policies.",
            "required_skills": ["Network Security", "SIEM", "Vulnerability Assessment", "Firewalls"],
            "expected_relevance": 0.10,
            "relevance_tier": "Irrelevant"
        },
        {
            "id": "match-07",
            "resume_skills": ["Python", "Pandas", "SQL", "Tableau", "Excel", "Data Cleaning"],
            "job_title": "Data Analyst",
            "job_description": "Junior to Mid Data Analyst to write complex SQL aggregations, build executive dashboards in Tableau or PowerBI, and clean large datasets in Python.",
            "required_skills": ["SQL", "Tableau", "Python", "Data Cleaning", "Excel"],
            "expected_relevance": 0.92,
            "relevance_tier": "High"
        },
        {
            "id": "match-08",
            "resume_skills": ["Java", "Spring Boot", "MySQL", "REST APIs", "Git"],
            "job_title": "Python Developer",
            "job_description": "Python Developer to create automated data integration workflows and backend microservices with Python, FastAPI/Django, and PostgreSQL.",
            "required_skills": ["Python", "FastAPI", "PostgreSQL", "REST APIs"],
            "expected_relevance": 0.50,
            "relevance_tier": "Moderate"
        }
    ]

    file_path = os.path.join(DATASETS_DIR, "job_matching_benchmark.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(benchmark, f, indent=2)
    print(f"[Dataset] Job matching benchmark created with {len(benchmark)} pairs at {file_path}")
    return benchmark

def generate_interview_dataset():
    """
    Creates labeled dataset for mock interview evaluation.
    Categories: exemplary (4), proficient (3), developing (2), insufficient (1)
    """
    records = [
        # Exemplary answers
        {
            "question": "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
            "answer": "SQL databases are relational, table-based, and enforce structured schemas with ACID transactions, making them ideal for financial or inventory systems requiring data integrity. NoSQL databases, like document stores (MongoDB) or key-value caches (Redis), offer dynamic schemas and horizontal scaling, suited for unstructured data, high-velocity ingestion, or rapid prototyping.",
            "role": "Backend Developer",
            "relevance_score": 95.0,
            "technical_coverage": 92.0,
            "quality_tier": "exemplary",
            "tier_label": 3,
            "expected_concepts": "relational, ACID, schema, NoSQL, horizontal scaling, document store, use cases"
        },
        {
            "question": "What is the React Virtual DOM and how does reconciliation work?",
            "answer": "The Virtual DOM is a lightweight in-memory JavaScript representation of the real DOM. When state changes, React generates a new Virtual DOM tree and diffs it with the previous tree using a heuristic reconciliation algorithm. It calculates the minimal set of actual DOM updates needed, batching changes to avoid expensive layout thrashing.",
            "role": "Frontend Developer",
            "relevance_score": 96.0,
            "technical_coverage": 94.0,
            "quality_tier": "exemplary",
            "tier_label": 3,
            "expected_concepts": "Virtual DOM, diffing algorithm, reconciliation, batching, state updates, real DOM"
        },
        {
            "question": "What is the difference between overfitting and underfitting in machine learning, and how do you prevent them?",
            "answer": "Overfitting happens when a model learns noise in training data and fails to generalize to unseen test data, resulting in low training error but high test error. It is mitigated using regularization (L1/L2), cross-validation, pruning, dropout, or acquiring more data. Underfitting occurs when the model is too simple to capture underlying patterns, fixed by increasing model capacity, feature engineering, or reducing regularization.",
            "role": "Data Scientist",
            "relevance_score": 98.0,
            "technical_coverage": 96.0,
            "quality_tier": "exemplary",
            "tier_label": 3,
            "expected_concepts": "overfitting, underfitting, generalization, regularization, cross-validation, feature engineering"
        },
        {
            "question": "Explain how Docker containers differ from Virtual Machines.",
            "answer": "Docker containers share the host operating system kernel and run as isolated processes in user space using Linux namespaces and cgroups, making them lightweight, fast to boot, and resource-efficient. In contrast, Virtual Machines run a full guest OS hypervised on virtualized hardware, consuming significantly more CPU, RAM, and storage.",
            "role": "Cloud Engineer",
            "relevance_score": 95.0,
            "technical_coverage": 94.0,
            "quality_tier": "exemplary",
            "tier_label": 3,
            "expected_concepts": "shared kernel, namespaces, cgroups, hypervisor, guest OS, isolation, overhead"
        },

        # Proficient answers
        {
            "question": "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
            "answer": "SQL databases have strict schemas and tables with rows and columns. They use SQL to query data and ensure consistency. NoSQL databases are non-relational like MongoDB which stores JSON documents. You pick SQL when you need relational data and transactions, and NoSQL when you need scalability and flexible schema.",
            "role": "Backend Developer",
            "relevance_score": 82.0,
            "technical_coverage": 78.0,
            "quality_tier": "proficient",
            "tier_label": 2,
            "expected_concepts": "schema, relational, tables, JSON documents, scalability"
        },
        {
            "question": "What is the React Virtual DOM and how does reconciliation work?",
            "answer": "React creates a copy of the DOM in memory called Virtual DOM. When you update state, it compares the new virtual DOM with the old one, finds the differences, and only updates the parts of the real DOM that actually changed. This makes React apps faster.",
            "role": "Frontend Developer",
            "relevance_score": 84.0,
            "technical_coverage": 80.0,
            "quality_tier": "proficient",
            "tier_label": 2,
            "expected_concepts": "virtual DOM, state update, diffing, real DOM updates"
        },
        {
            "question": "What is the difference between overfitting and underfitting in machine learning, and how do you prevent them?",
            "answer": "Overfitting is when the model performs very well on training data but poorly on test data. Underfitting is when the model is not learning enough on either. You prevent overfitting by using regularization, dropout, or collecting more training samples.",
            "role": "Data Scientist",
            "relevance_score": 85.0,
            "technical_coverage": 80.0,
            "quality_tier": "proficient",
            "tier_label": 2,
            "expected_concepts": "training error, test error, regularization, dropout, data collection"
        },
        {
            "question": "Explain how Docker containers differ from Virtual Machines.",
            "answer": "Containers share the host operating system, while virtual machines have their own complete guest operating system running on a hypervisor. Therefore containers start much faster and take up less memory than VMs.",
            "role": "Cloud Engineer",
            "relevance_score": 82.0,
            "technical_coverage": 76.0,
            "quality_tier": "proficient",
            "tier_label": 2,
            "expected_concepts": "host OS, hypervisor, guest OS, resource footprint"
        },

        # Developing answers
        {
            "question": "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
            "answer": "SQL is for relational data like MySQL with tables. NoSQL is newer and doesn't use SQL. I usually use SQL because it's standard and I know how to write SELECT queries.",
            "role": "Backend Developer",
            "relevance_score": 60.0,
            "technical_coverage": 48.0,
            "quality_tier": "developing",
            "tier_label": 1,
            "expected_concepts": "relational, tables, queries"
        },
        {
            "question": "What is the React Virtual DOM and how does reconciliation work?",
            "answer": "The Virtual DOM is React's way of rendering things faster. It does some background checks before updating the website page so it doesn't reload the whole page.",
            "role": "Frontend Developer",
            "relevance_score": 58.0,
            "technical_coverage": 45.0,
            "quality_tier": "developing",
            "tier_label": 1,
            "expected_concepts": "rendering, updates, page reload"
        },
        {
            "question": "What is the difference between overfitting and underfitting in machine learning, and how do you prevent them?",
            "answer": "Overfitting is when the algorithm is too accurate on the training dataset. Underfitting means it's not accurate. You can fix it by changing hyperparameters.",
            "role": "Data Scientist",
            "relevance_score": 55.0,
            "technical_coverage": 42.0,
            "quality_tier": "developing",
            "tier_label": 1,
            "expected_concepts": "accuracy, training data, hyperparameters"
        },
        {
            "question": "Explain how Docker containers differ from Virtual Machines.",
            "answer": "Docker is for packing software into an image. Virtual machines are like running VMware or VirtualBox on your PC. Docker is easier to run.",
            "role": "Cloud Engineer",
            "relevance_score": 52.0,
            "technical_coverage": 40.0,
            "quality_tier": "developing",
            "tier_label": 1,
            "expected_concepts": "images, VMware, packaging"
        },

        # Insufficient answers
        {
            "question": "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
            "answer": "I don't know much about databases, I just connect to whatever database the company provides and use an ORM.",
            "role": "Backend Developer",
            "relevance_score": 15.0,
            "technical_coverage": 10.0,
            "quality_tier": "insufficient",
            "tier_label": 0,
            "expected_concepts": "none"
        },
        {
            "question": "What is the React Virtual DOM and how does reconciliation work?",
            "answer": "React uses HTML and JavaScript to build websites. You use components to show buttons and divs.",
            "role": "Frontend Developer",
            "relevance_score": 20.0,
            "technical_coverage": 12.0,
            "quality_tier": "insufficient",
            "tier_label": 0,
            "expected_concepts": "components"
        },
        {
            "question": "What is the difference between overfitting and underfitting in machine learning, and how do you prevent them?",
            "answer": "Fitting is about machine learning training. If it fits well it works, if it doesn't fit you restart training.",
            "role": "Data Scientist",
            "relevance_score": 18.0,
            "technical_coverage": 10.0,
            "quality_tier": "insufficient",
            "tier_label": 0,
            "expected_concepts": "training"
        },
        {
            "question": "Explain how Docker containers differ from Virtual Machines.",
            "answer": "Docker is used in cloud computers. VMs are old technology that people don't use anymore.",
            "role": "Cloud Engineer",
            "relevance_score": 22.0,
            "technical_coverage": 15.0,
            "quality_tier": "insufficient",
            "tier_label": 0,
            "expected_concepts": "cloud"
        }
    ]

    # Expand sample variations with slight paraphrasing to increase statistical power
    expanded = []
    for r in records:
        expanded.append(r)
        # Variant 1: add slight modifier
        v1 = dict(r)
        v1["answer"] = f"In my experience, {v1['answer'].lower()}"
        expanded.append(v1)

    df = pd.DataFrame(expanded)
    file_path = os.path.join(DATASETS_DIR, "interview_evaluation_dataset.csv")
    df.to_csv(file_path, index=False)
    print(f"[Dataset] Interview evaluation dataset created with {len(df)} samples at {file_path}")
    return df

if __name__ == "__main__":
    generate_skills_dataset()
    generate_job_matching_benchmark()
    generate_interview_dataset()
    print("All datasets generated successfully!")

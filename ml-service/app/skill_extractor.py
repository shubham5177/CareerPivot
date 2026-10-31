"""
CareerPivot AI - Skill Extractor & Model 1 Classifier Integration
Combines keyword phrase extraction with supervised Model 1 classification to
categorize technical & professional skills.
"""

import os
import re
import joblib
from typing import List, Dict, Any

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(BASE_DIR, "models", "skill_classifier_pipeline.joblib")

# Master skill lookup dictionary with canonical names and aliases
KNOWN_SKILLS = [
    # Frontend
    {"name": "React", "aliases": ["react", "react.js", "reactjs"]},
    {"name": "Next.js", "aliases": ["next.js", "nextjs", "next"]},
    {"name": "TypeScript", "aliases": ["typescript", "ts"]},
    {"name": "JavaScript", "aliases": ["javascript", "js", "es6", "es6+"]},
    {"name": "Tailwind CSS", "aliases": ["tailwind", "tailwind css", "tailwindcss"]},
    {"name": "HTML5 & CSS3", "aliases": ["html", "html5", "css", "css3", "sass", "scss"]},
    {"name": "Vue.js", "aliases": ["vue", "vue.js", "vuejs"]},
    {"name": "Angular", "aliases": ["angular", "angular.js"]},
    {"name": "Redux", "aliases": ["redux", "redux toolkit"]},

    # Backend & Programming
    {"name": "Python", "aliases": ["python", "python3"]},
    {"name": "FastAPI", "aliases": ["fastapi", "fast api"]},
    {"name": "Node.js", "aliases": ["node", "node.js", "nodejs"]},
    {"name": "Express.js", "aliases": ["express", "express.js", "expressjs"]},
    {"name": "Django", "aliases": ["django", "django rest framework", "drf"]},
    {"name": "Flask", "aliases": ["flask"]},
    {"name": "RESTful APIs", "aliases": ["rest", "restful", "rest api", "restful api", "apis"]},
    {"name": "GraphQL", "aliases": ["graphql"]},
    {"name": "Java", "aliases": ["java", "spring", "spring boot"]},
    {"name": "Go (Golang)", "aliases": ["golang", "go"]},
    {"name": "C++", "aliases": ["c++", "cpp"]},
    {"name": "C#", "aliases": ["c#", "csharp", ".net"]},

    # Database
    {"name": "SQL", "aliases": ["sql", "relational database"]},
    {"name": "PostgreSQL", "aliases": ["postgres", "postgresql"]},
    {"name": "MySQL", "aliases": ["mysql"]},
    {"name": "MongoDB", "aliases": ["mongodb", "mongo"]},
    {"name": "Redis", "aliases": ["redis"]},
    {"name": "SQLite", "aliases": ["sqlite", "sqlite3"]},

    # Cloud & DevOps
    {"name": "Docker", "aliases": ["docker", "containerization", "containers"]},
    {"name": "Kubernetes", "aliases": ["kubernetes", "k8s"]},
    {"name": "AWS", "aliases": ["aws", "amazon web services", "s3", "ec2", "lambda"]},
    {"name": "Google Cloud Platform", "aliases": ["gcp", "google cloud"]},
    {"name": "Microsoft Azure", "aliases": ["azure"]},
    {"name": "Terraform", "aliases": ["terraform", "iac"]},
    {"name": "CI/CD Pipelines", "aliases": ["ci/cd", "cicd", "github actions", "gitlab ci", "jenkins"]},
    {"name": "Linux", "aliases": ["linux", "bash", "shell"]},

    # Data & ML
    {"name": "Pandas & NumPy", "aliases": ["pandas", "numpy"]},
    {"name": "Scikit-Learn", "aliases": ["scikit-learn", "sklearn", "scikitlearn"]},
    {"name": "PyTorch / TensorFlow", "aliases": ["pytorch", "tensorflow", "keras", "deep learning"]},
    {"name": "NLP (Natural Language Processing)", "aliases": ["nlp", "natural language processing", "spacy", "nltk", "llm", "rag"]},
    {"name": "Data Visualization", "aliases": ["data visualization", "tableau", "powerbi", "plotly", "matplotlib", "seaborn"]},

    # Security
    {"name": "Network Security", "aliases": ["network security", "firewall", "ids/ips", "vpn"]},
    {"name": "SIEM & SOC Operations", "aliases": ["siem", "soc", "splunk", "sentinel"]},
    {"name": "Vulnerability Assessment", "aliases": ["vulnerability assessment", "nessus", "penetration testing", "pen test", "owasp"]},

    # Soft Skills
    {"name": "Problem Solving & Algorithmic Thinking", "aliases": ["problem solving", "algorithms", "data structures", "analytical"]},
    {"name": "Technical Communication", "aliases": ["communication", "technical writing", "presentation", "stakeholder"]},
    {"name": "Agile & Scrum Methodologies", "aliases": ["agile", "scrum", "sprints", "jira", "kanban"]}
]

class SkillExtractorService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                print(f"[SkillExtractor] Model 1 loaded from {MODEL_PATH}")
            except Exception as e:
                print(f"[SkillExtractor] Failed to load Model 1: {e}")
        else:
            print(f"[SkillExtractor] Model 1 artifact not found at {MODEL_PATH}")

    def extract_skills_from_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Scans text for known skills, removes duplicates, and classifies each using Model 1.
        """
        extracted = []
        found_names = set()
        text_lower = text.lower()

        # Word boundary token search
        for skill in KNOWN_SKILLS:
            canonical_name = skill["name"]
            matched = False
            for alias in skill["aliases"]:
                # Use regex word boundaries
                pattern = rf'(?:^|[^a-zA-Z0-9_\+#\.\-]){re.escape(alias)}(?:[^a-zA-Z0-9_\+#\.\-]|$)'
                if re.search(pattern, text_lower):
                    matched = True
                    break

            if matched and canonical_name not in found_names:
                found_names.add(canonical_name)
                # Predict category using Model 1 if loaded
                category = "programming"
                conf = 0.95
                if self.model:
                    try:
                        pred_cat = self.model.predict([canonical_name])[0]
                        category = pred_cat
                        # Check confidence
                        if hasattr(self.model, "predict_proba"):
                            probs = self.model.predict_proba([canonical_name])[0]
                            conf = float(max(probs))
                    except Exception:
                        pass

                extracted.append({
                    "name": canonical_name,
                    "category": category,
                    "confidence": round(conf, 2)
                })

        return extracted

# Singleton instance
skill_extractor = SkillExtractorService()

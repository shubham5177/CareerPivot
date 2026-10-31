"""
CareerPivot AI - Training Pipeline for Model 1: Skill Categorization
Trains a supervised text classification baseline to categorize technical & professional skills
into: frontend, backend, database, cloud, programming, soft_skills, data_ml, security.
"""

import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, f1_score, confusion_matrix
from evaluation_utils import skill_groups

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "datasets", "skills_dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_skill_classifier():
    print("=== Training Model 1: Skill Categorization ===")
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} skill samples across {df['category'].nunique()} categories.")

    X = df["text"].astype(str)
    y = df["category"]

    # Keep generated paraphrases of the same skill phrase in a single split.
    splitter = StratifiedGroupKFold(n_splits=4, shuffle=True, random_state=42)
    train_indices, test_indices = next(splitter.split(X, y, groups=skill_groups(X)))
    X_train, X_test = X.iloc[train_indices], X.iloc[test_indices]
    y_train, y_test = y.iloc[train_indices], y.iloc[test_indices]

    # ML Pipeline: TF-IDF n-grams + Logistic Regression with balanced weights
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=2000, sublinear_tf=True)),
        ("classifier", LogisticRegression(C=2.5, max_iter=1000, class_weight="balanced", random_state=42))
    ])

    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average="macro")
    f1_weighted = f1_score(y_test, y_pred, average="weighted")

    print(f"\n[Test Set Results]")
    print(f"Accuracy:    {acc * 100:.2f}%")
    print(f"Macro F1:    {f1_macro * 100:.2f}%")
    print(f"Weighted F1: {f1_weighted * 100:.2f}%\n")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Save artifacts
    model_path = os.path.join(MODELS_DIR, "skill_classifier_pipeline.joblib")
    joblib.dump(pipeline, model_path)
    print(f"Saved trained skill classifier pipeline to {model_path}")

    # Save metadata & category list
    categories = sorted(list(y.unique()))
    meta = {
        "model_name": "skill_classifier",
        "algorithm": "TfidfVectorizer + LogisticRegression",
        "categories": categories,
        "test_accuracy": round(float(acc), 4),
        "test_f1_macro": round(float(f1_macro), 4),
        "test_f1_weighted": round(float(f1_weighted), 4),
        "n_samples": len(df),
        "test_samples": len(X_test),
        "evaluation_method": "stratified_group_holdout_by_normalized_skill_phrase",
        "data_provenance": "synthetic skill taxonomy with generated phrase variants"
    }
    meta_path = os.path.join(MODELS_DIR, "skill_classifier_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    return meta

if __name__ == "__main__":
    train_skill_classifier()

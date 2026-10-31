"""
CareerPivot AI - Training Pipeline for Model 3: Mock Interview Evaluator
Trains a supervised classification pipeline evaluating interview answer quality,
structure, and technical relevance into 4 tiers:
[insufficient (0), developing (1), proficient (2), exemplary (3)]
"""

import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import StratifiedGroupKFold, cross_val_predict, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from evaluation_utils import interview_groups

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "datasets", "interview_evaluation_dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_interview_evaluator():
    print("=== Training Model 3: Mock Interview Evaluator ===")
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} interview response samples.")

    # Input: Question + Answer context
    X = (df["question"] + " [SEP] " + df["answer"]).astype(str)
    y = df["quality_tier"]

    # Train-test evaluation via Stratified K-Fold (due to dataset size)
    skf = StratifiedGroupKFold(n_splits=4, shuffle=True, random_state=42)
    groups = interview_groups(df["question"], df["answer"])

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
        ("classifier", LogisticRegression(C=1.5, max_iter=500, random_state=42))
    ])

    scores = cross_val_score(pipeline, X, y, cv=skf, groups=groups, scoring="accuracy")
    f1_scores = cross_val_score(pipeline, X, y, cv=skf, groups=groups, scoring="f1_macro")
    cv_predictions = cross_val_predict(pipeline, X, y, cv=skf, groups=groups)
    print(f"4-Fold Cross Validation Accuracy: {scores.mean() * 100:.2f}% (+/- {scores.std() * 100:.2f}%)")
    print(f"4-Fold Cross Validation Macro F1: {f1_scores.mean() * 100:.2f}% (+/- {f1_scores.std() * 100:.2f}%)")
    print("\nGrouped cross-validation classification report:")
    print(classification_report(y, cv_predictions, zero_division=0))

    # Fit final model on full dataset
    pipeline.fit(X, y)
    y_pred = pipeline.predict(X)
    train_acc = accuracy_score(y, y_pred)
    print(f"Fitted model accuracy: {train_acc * 100:.2f}%\n")
    print(classification_report(y, y_pred))

    cm = confusion_matrix(y, y_pred, labels=["insufficient", "developing", "proficient", "exemplary"])
    print("Confusion Matrix:")
    print(cm)

    # Save artifact
    model_path = os.path.join(MODELS_DIR, "interview_evaluator.joblib")
    joblib.dump(pipeline, model_path)
    print(f"\nSaved interview evaluator pipeline to {model_path}")

    meta = {
        "model_name": "interview_evaluator",
        "algorithm": "TfidfVectorizer + Multinomial Logistic Regression",
        "tiers": ["insufficient", "developing", "proficient", "exemplary"],
        "cv_accuracy_mean": round(float(scores.mean()), 4),
        "cv_accuracy_std": round(float(scores.std()), 4),
        "cv_f1_macro_mean": round(float(f1_scores.mean()), 4),
        "cv_f1_macro_std": round(float(f1_scores.std()), 4),
        "train_accuracy": round(float(train_acc), 4),
        "n_samples": len(df),
        "evaluation_method": "stratified_grouped_4_fold_by_normalized_question_answer",
        "data_provenance": "synthetic/curated answer examples with generated text variants"
    }
    meta_path = os.path.join(MODELS_DIR, "interview_evaluator_meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    return meta

if __name__ == "__main__":
    train_interview_evaluator()

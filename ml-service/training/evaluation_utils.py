import re
from typing import Iterable, List


def skill_groups(texts: Iterable[str]) -> List[str]:
    prefixes = re.compile(r"^(?:proficient in|experienced with)\s+", re.IGNORECASE)
    return [prefixes.sub("", str(text)).strip().lower() for text in texts]


def interview_groups(questions: Iterable[str], answers: Iterable[str]) -> List[str]:
    prefix = re.compile(r"^in my experience,\s*", re.IGNORECASE)
    return [
        f"{str(question).strip().lower()} [SEP] {prefix.sub('', str(answer)).strip().lower()}"
        for question, answer in zip(questions, answers)
    ]

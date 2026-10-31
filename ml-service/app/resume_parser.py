"""
CareerPivot AI - Resume Document Parser & Section Extractor
Extracts and structures information from PDF, DOCX, and text resumes.
"""

import re
import fitz  # PyMuPDF
from docx import Document
from io import BytesIO
from typing import Dict, Any, List, Tuple

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF bytes using PyMuPDF."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text_chunks = []
    for page in doc:
        text_chunks.append(page.get_text())
    doc.close()
    return "\n".join(text_chunks)

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from DOCX bytes using python-docx."""
    doc = Document(BytesIO(file_bytes))
    text_chunks = []
    for para in doc.paragraphs:
        if para.text.strip():
            text_chunks.append(para.text)
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
            if row_text:
                text_chunks.append(row_text)
    return "\n".join(text_chunks)

def clean_text(raw_text: str) -> str:
    """Normalizes whitespace and removes unprintable characters."""
    text = re.sub(r'[\r\t]', ' ', raw_text)
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ ]{2,}', ' ', text)
    return text.strip()

def extract_contact_info(text: str) -> Tuple[str, str, str]:
    """Extracts candidate name, email, and phone number using patterns."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    name = "Candidate"
    if lines:
        first_line = lines[0]
        # Ignore if first line is a section header like RESUME or CURRICULUM VITAE
        if not re.search(r'(resume|curriculum|cv|profile)', first_line, re.IGNORECASE) and len(first_line.split()) <= 4:
            name = first_line

    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    email = email_match.group(0) if email_match else ""

    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else ""

    return name, email, phone

def parse_resume_sections(text: str) -> Dict[str, Any]:
    """
    Splits resume text into Education, Experience, Skills, and Projects sections
    based on common standard section headers.
    """
    sections = {
        "education": [],
        "experience": [],
        "skills_raw": [],
        "projects": [],
        "certifications": []
    }

    # Common section markers
    section_patterns = {
        "education": r'(?:EDUCATION|ACADEMIC BACKGROUND|DEGREES)',
        "experience": r'(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|PROFESSIONAL EXPERIENCE)',
        "skills": r'(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|AREAS OF EXPERTISE)',
        "projects": r'(?:PROJECTS|PERSONAL PROJECTS|KEY PROJECTS|PORTFOLIO)',
        "certifications": r'(?:CERTIFICATIONS|CERTIFICATES|LICENSES)'
    }

    # Find headers and indices
    found_headers = []
    for section_name, pattern in section_patterns.items():
        for m in re.finditer(rf'^\s*{pattern}\s*$', text, re.IGNORECASE | re.MULTILINE):
            found_headers.append((m.start(), m.end(), section_name))

    found_headers.sort(key=lambda x: x[0])

    section_texts = {}
    for i in range(len(found_headers)):
        start_idx = found_headers[i][1]
        end_idx = found_headers[i + 1][0] if i + 1 < len(found_headers) else len(text)
        sec_name = found_headers[i][2]
        content = text[start_idx:end_idx].strip()
        section_texts[sec_name] = content

    # Structure Education
    if "education" in section_texts:
        edu_lines = [l.strip() for l in section_texts["education"].split("\n") if l.strip()]
        current_edu = {}
        for line in edu_lines:
            degree_match = re.search(r'(B\.S\.|M\.S\.|Bachelor|Master|Ph\.D\.|Associate|Diploma|High School|B\.Tech|M\.Tech|Degree)', line, re.IGNORECASE)
            year_match = re.search(r'(19\d\d|20\d\d)(?:\s*-\s*(19\d\d|20\d\d|Present))?', line)
            
            if degree_match or year_match:
                if current_edu:
                    sections["education"].append(current_edu)
                current_edu = {
                    "degree": line,
                    "institution": "",
                    "year": year_match.group(0) if year_match else ""
                }
            elif current_edu and not current_edu["institution"]:
                current_edu["institution"] = line
        if current_edu:
            sections["education"].append(current_edu)

    # Structure Experience
    if "experience" in section_texts:
        exp_lines = [l.strip() for l in section_texts["experience"].split("\n") if l.strip()]
        current_exp = {}
        for line in exp_lines:
            # Check for role/company line (usually includes dates or title keywords)
            date_match = re.search(r'(19\d\d|20\d\d|Present|Current)', line, re.IGNORECASE)
            title_match = re.search(r'(developer|engineer|analyst|manager|consultant|lead|intern|designer|specialist)', line, re.IGNORECASE)
            
            if (date_match or title_match) and len(line) < 120 and not line.startswith(('-', '•', '*')):
                if current_exp:
                    sections["experience"].append(current_exp)
                current_exp = {
                    "role": line,
                    "company": "",
                    "duration": date_match.group(0) if date_match else "",
                    "description": ""
                }
            elif current_exp:
                if line.startswith(('-', '•', '*')):
                    desc = current_exp["description"]
                    current_exp["description"] = f"{desc}\n{line}".strip()
                elif not current_exp["company"]:
                    current_exp["company"] = line
                else:
                    current_exp["description"] += " " + line
        if current_exp:
            sections["experience"].append(current_exp)

    # Structure Projects
    if "projects" in section_texts:
        proj_lines = [l.strip() for l in section_texts["projects"].split("\n") if l.strip()]
        current_proj = {}
        for line in proj_lines:
            if not line.startswith(('-', '•', '*')) and len(line) < 80:
                if current_proj:
                    sections["projects"].append(current_proj)
                current_proj = {
                    "name": line,
                    "technologies": "",
                    "description": ""
                }
            elif current_proj:
                if "technologies" in line.lower() or "tech stack" in line.lower():
                    current_proj["technologies"] = line
                else:
                    current_proj["description"] += " " + line
        if current_proj:
            sections["projects"].append(current_proj)

    if "certifications" in section_texts:
        sections["certifications"] = [
            re.sub(r"^[-*•\s]+", "", line).strip()
            for line in section_texts["certifications"].split("\n")
            if line.strip()
        ]

    return sections

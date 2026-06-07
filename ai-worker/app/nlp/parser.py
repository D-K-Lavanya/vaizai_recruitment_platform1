import re
import spacy
from spacy.matcher import Matcher

# Load SpaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    # Fallback or instructions would be handled at the app level
    nlp = None

# A more comprehensive technical skills database
SKILL_DB = [
    "Python", "Java", "JavaScript", "React", "Node.js", "Express", "MongoDB",
    "PostgreSQL", "SQL", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Machine Learning", "Data Science", "NLP", "FastAPI", "Flask", "Django",
    "TypeScript", "HTML", "CSS", "C++", "C#", "Go", "Rust", "TensorFlow", "PyTorch",
    "Angular", "Vue.js", "Svelte", "Redux", "GraphQL", "Apollo", "Redis", "Elasticsearch",
    "Firebase", "Git", "Jenkins", "Terraform", "Ansible", "Linux", "Unix", "Bash",
    "Spark", "Hadoop", "Kafka", "Tableau", "PowerBI", "R", "Scala", "PHP", "Laravel",
    "Ruby", "Rails", "Swift", "Kotlin", "Flutter", "React Native", "Three.js", "D3.js"
]

def extract_email(text):
    """Extract email using regex."""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_name(doc):
    """Extract name using SpaCy NER (PERSON entity) with improved filtering."""
    # Names usually appear in the first few lines
    header = doc[:200]
    for ent in header.ents:
        if ent.label_ == "PERSON":
            name = ent.text.strip().replace("\n", " ")
            # Basic validation: Name shouldn't be a single character or contain symbols
            if len(name.split()) >= 2 and not any(char in name for char in "@:/._"):
                return name
    
    # Fallback: Take the first non-empty line that doesn't look like an email or skill
    lines = [line.strip() for line in doc.text.split('\n') if line.strip()]
    for line in lines[:5]:
        if "@" not in line and len(line.split()) >= 2 and len(line) < 50:
            return line
            
    return "Candidate Name"

def extract_skills(doc):
    """Extract skills using DB matching and Noun Phrase analysis."""
    found_skills = set()
    text_lower = doc.text.lower()
    
    # 1. DB Matching
    for skill in SKILL_DB:
        pattern = rf'\b{re.escape(skill.lower())}\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
    
    # 2. Noun Phrase extraction (for new/unseen skills)
    # We look for proper nouns that are often used as skills
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip()
        if len(chunk_text) > 1 and chunk_text[0].isupper():
            # If it's capitalized and not already a name/stopword, it might be a skill
            if chunk_text.lower() not in spacy.lang.en.stop_words.STOP_WORDS:
                # Add if it looks like a tech term (very basic heuristic)
                if any(tech in chunk_text.lower() for tech in ["js", "api", "engine", "service", "framework"]):
                    found_skills.add(chunk_text)
                    
    return list(found_skills)

def extract_phone(text):
    """Extract phone number using regex."""
    phone_pattern = r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else None

def parse_resume_text(raw_text):
    """
    Core logic to parse resume text and return structured data.
    """
    if not nlp:
        # If model is not loaded, we still try to get regex-based data
        email = extract_email(raw_text)
        phone = extract_phone(raw_text)
        # Simple string-based extraction fallback
        found_skills = []
        for skill in SKILL_DB:
            if re.search(rf'\b{re.escape(skill.lower())}\b', raw_text.lower()):
                found_skills.append(skill)
        
        return {
            "name": "Unknown (Model not loaded)",
            "email": email,
            "phone": phone,
            "skills": found_skills,
            "raw_text_length": len(raw_text)
        }

    doc = nlp(raw_text)
    
    # Extraction
    name = extract_name(doc)
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    skills = extract_skills(doc)
    
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "raw_text": raw_text,
        "raw_text_length": len(raw_text)
    }

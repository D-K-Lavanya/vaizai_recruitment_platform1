import os
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pypdf import PdfReader
import spacy

app = FastAPI()

# Load Spacy model for NLP
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print(f"Error loading Spacy model: {e}")

class ParseRequest(BaseModel):
    filePath: str

@app.get("/")
async def root():
    return {"message": "Python AI Service is active and listening for dynamic parsing requests."}

@app.post("/api/nlp-parse")
async def nlp_parse(request: ParseRequest):
    file_path = request.filePath
    abs_path = os.path.abspath(file_path)
    
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail=f"File not found at path: {abs_path}")
    
    try:
        reader = PdfReader(abs_path)
        raw_text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                raw_text += page_text + "\n"
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # Comprehensive Technical Skills Database
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

        # 1. DYNAMIC NAME EXTRACTION
        header_text = raw_text[:500]
        doc = nlp(header_text)
        extracted_name = None
        
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                candidate_name = ent.text.strip().replace("\n", " ")
                if len(candidate_name.split()) >= 1 and not re.search(r'[@:/]', candidate_name):
                    extracted_name = candidate_name
                    break
        
        # Enhanced Fallback: Skip skills and emails
        if not extracted_name:
            lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
            for line in lines:
                if line.lower() in [s.lower() for s in SKILL_DB] and len(line.split()) == 1:
                    continue
                if "@" in line or re.search(r'\d', line) or len(line) < 2:
                    continue
                extracted_name = line
                break
            
            if not extracted_name:
                extracted_name = "Unknown Candidate"

        # 2. DYNAMIC CONTACT EXTRACTION
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', raw_text)
        email = email_match.group(0) if email_match else "Not Found"

        # 3. SKILL EXTRACTION
        found_skills = []
        for skill in SKILL_DB:
            if re.search(rf'\b{re.escape(skill.lower())}\b', raw_text.lower()):
                found_skills.append(skill)
        
        # Experience detection
        experience_match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|work)', raw_text, re.IGNORECASE)
        experience_years = int(experience_match.group(1)) if experience_match else 0

        return {
            "name": extracted_name,
            "email": email,
            "skills": list(set(found_skills)),
            "experience_years": experience_years,
            "status": "Success"
        }

    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

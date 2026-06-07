import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pypdf import PdfReader
from app.nlp.parser import parse_resume_text

app = FastAPI(title="VaizAI NLP Worker")

@app.get("/")
async def root():
    return {"status": "AI Worker Online", "model": "en_core_web_sm"}

class ParseRequest(BaseModel):
    filePath: str

@app.post("/api/nlp-parse")
async def nlp_parse(request: ParseRequest):
    file_path = request.filePath
    
    try:
        # Ensure absolute path for reliability
        abs_path = os.path.abspath(file_path)
        
        if not os.path.exists(abs_path):
            return {
                "name": "File Not Found",
                "email": None,
                "phone": None,
                "skills": [],
                "error": f"Path does not exist: {abs_path}",
                "fallback": True
            }

        # 1. Extract raw text content using pypdf
        reader = PdfReader(abs_path)
        raw_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                raw_text += text + "\n"
        
        if not raw_text.strip():
            return {
                "name": "Unparseable PDF",
                "email": None,
                "phone": None,
                "skills": [],
                "error": "Could not extract text from PDF (empty or image-based)",
                "fallback": True
            }

        # 2. Pass text to the spaCy parsing routine
        structured_data = parse_resume_text(raw_text)
        structured_data["fallback"] = False
        
        return structured_data

    except Exception as e:
        print(f"Graceful Extraction Error: {str(e)}")
        # Return valid JSON payload with fallback metadata instead of crashing
        return {
            "name": "Extraction Error",
            "email": None,
            "phone": None,
            "skills": [],
            "error": str(e),
            "fallback": True
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

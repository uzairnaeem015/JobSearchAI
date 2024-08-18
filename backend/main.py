from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil


from services.jobsServices import ScrapeJobs
from services.PDFHelper import PDF;
from services.JobScanAIModels import GoogleGemini

class searchJobRequest(BaseModel):
    job_title: str
    job_site: str
    location: str
    page_size: str

class JobScoreDetail(BaseModel):
    job_description: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers =["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/score_detail")
async def upload_pdf(job_description: str = Form(...), file: UploadFile = File(...)):
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)

    pdf = PDF()
    resume_content = pdf.readPDFContent(file.file)


    google_gemini = GoogleGemini()

    response = google_gemini.job_similarity_score(job_description, resume_content, verbose= False)

    return {"Gemini Result": response}


@app.post("/search_jobs")
def search_jobs(job_title: str = Form(...),location: str = Form(...),page_size: str = Form(...), job_site: str = Form(...), file: UploadFile = File(...)):
    
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)
    
    pdf = PDF()
    resume_content = pdf.readPDFContent(file.file)

    processor = ScrapeJobs(job_title, location, int(page_size), job_site,  72)

    result = processor.retrieve_jobs(resume_content, verbose = False)

    return {
        "result" : result
    }
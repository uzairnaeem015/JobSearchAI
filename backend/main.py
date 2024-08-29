from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil



from services.jobsServices import ScrapeJobs
from services.PDFHelper import PDF;
from services.JobScanAIModels import GoogleGemini
from services.DBService import MongoDB


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
async def score_detail(job_description: str = Form(...), 
                     model: str = Form(...), 
                     api_key: str = Form(default=None), 
                     email: str = Form(default=None), 
                     file: UploadFile = File(...)):
    
    # Check if the uploaded file is a PDF
    if file and file.content_type != "application/pdf":
        return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)

    pdf = PDF()
    resume_content = pdf.readPDFContent(file.file)

    google_gemini = GoogleGemini(model, api_key)

    response = google_gemini.job_similarity_score(job_description, resume_content,  email, verbose= False)

    return {"Gemini Result": response}


@app.post("/search_jobs")
def search_jobs(job_title: str = Form(...),
                location: str = Form(...), 
                job_site: str = Form(...), 
                scrape: bool = Form(None),  
                last_id: str = Form(None), 
                file: UploadFile = File(None)):
    
    # Check if the uploaded file is a PDF
    if file and file.content_type != "application/pdf":
        return JSONResponse(content={"message": "Only PDF files are allowed"}, status_code=400)
    
    pdf = PDF()

    if file:
        resume_content = pdf.readPDFContent(file.file)
    else:
        resume_content = ""

    processor = ScrapeJobs(job_title, location, 25, job_site,  24)
    
    result = processor.retrieve_jobs(resume_content, bool(scrape), last_id,  remove_stopwords= True,  verbose = False)

    return {
        "result" : result
    }

@app.post("/get_job_score_history_list")
def get_job_score_history_list(email: str = Form(None), password: str = Form(None)):
    
    if email is None or email == '': 
        return {
        "Result" : {"Message" : "Please enter email address." , "Success" : False}
    }
    if password is None or password == '': 
        return {
        "Result" : {"Message" : "Password cannot be empty" , "Success" : False}
    }

    db = MongoDB()

    auth = db.login_user(email, password)
    
    try:
        if auth["Success"] == True:
            response = db.fetch_score_history(email)
        
        return {
            "result" : response
        }
    except:
        return {
        "Result" : {"Message" : "Unable to authorize" , "Success" : False}
    }

@app.post("/get_selected_job_score")
def get_selected_job_score(id: str = Form(None), email: str = Form(None), password: str = Form(None)):
    
    if email is None or email == '': 
        return {
        "Result" : {"Message" : "Please enter email address." , "Success" : False}
    }
    if password is None or password == '': 
        return {
        "Result" : {"Message" : "Password cannot be empty" , "Success" : False}
    }

    if id is None or id == '': 
        return {
        "result" : "Invalid id"
    } 

    db = MongoDB()

    auth = db.login_user(email, password)
    
    try:
        if auth["Success"] == True:
            response = db.fetch_score_by_id(id)
        
        return {
            "result" : response
        }
    except:
        return {
        "Result" : {"Message" : "Unable to authorize" , "Success" : False}
    }
    

@app.post("/sign_up")
def sign_up(username: str = Form(None), email: str = Form(None), password: str = Form(None)):
    
    if username is None or username == '': 
        return {
        "Result" : {"Message" : "Please enter user name" , "Success" : False}
    }
    if email is None or email == '': 
        return {
        "Result" : {"Message" : "Please enter email address." , "Success" : False}
    }
    if password is None or password == '': 
        return {
        "Result" : {"Message" : "Password cannot be empty" , "Success" : False}
    }

    db = MongoDB()

    response = db.insert_new_user(username, email, password)
    
    return {
        "Result" : response
    }

@app.post("/login")
def login(email: str = Form(None), password: str = Form(None)):
    
    if email is None or email == '': 
        return {
        "Result" : {"Message" : "Please enter email address." , "Success" : False}
    }
    if password is None or password == '': 
        return {
        "Result" : {"Message" : "Password cannot be empty" , "Success" : False}
    }

    db = MongoDB()

    response = db.login_user(email, password)
    
    return {
        "Result" : response
    }
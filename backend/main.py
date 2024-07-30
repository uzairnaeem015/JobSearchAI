from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware

from services.jobsServices import LinkedInService


class searchJobRequest(BaseModel):
    job_title: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers =["*"],
)


@app.post("/search_jobs")
def search_jobs(request: searchJobRequest):
    
    processor = LinkedInService(request.job_title)

    result = processor.retrieve_jobs(verbose = True)

    return {
        "result" : result
    }
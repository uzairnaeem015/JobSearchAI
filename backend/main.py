from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware

from services.jobsServices import ScrapeJobs


class searchJobRequest(BaseModel):
    job_title: str
    job_type: str
    location: str

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
    
    processor = ScrapeJobs(request.job_title, request.location, 2, 72)

    result = processor.retrieve_jobs(verbose = True)

    return {
        "result" : result
    }
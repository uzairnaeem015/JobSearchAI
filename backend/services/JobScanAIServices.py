from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import re
import pandas as pd
import numpy as np
from numpy.linalg import norm

import google.generativeai as genai

import json
import logging

with open('config.json') as config_file:
    config = json.load(config_file)

# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Doc2VecGensim:
    # https://github.com/kirudang/CV-Job-matching/tree/main
    # https://medium.com/@kirudang/job-resume-matching-part-1-2-obtaining-similarity-score-using-doc2vec-a6d07fe3b355
    def __init__(self, model_path = '../models/cv_job_maching.model'):
        self.model = Doc2Vec.load(model_path)

    def preprocess_text(self, text):
        # Convert the text to lowercase
        text = text.lower()
        
        # Remove punctuation from the text
        text = re.sub('[^a-z]', ' ', text)
        
        # Remove numerical values from the text
        text = re.sub(r'\d+', '', text)
        
        # Remove extra whitespaces
        text = ' '.join(text.split())
        
        return text


    def check_similarity(self, resume_text, job_desc):
        input_CV = self.preprocess_text(resume_text)
        input_JD = self.preprocess_text(job_desc)

        v1 = self.model.infer_vector(input_CV.split()) # Input of CV
        v2 = self.model.infer_vector(input_JD.split()) # Input of JD
        similarity = 100*(np.dot(np.array(v1), np.array(v2))) / (norm(np.array(v1)) * norm(np.array(v2)))
        logging.info(round(similarity, 2))
        return round(similarity, 2)
    

class GoogleGemini:
    def __init__(self, model = "gemini-1.5-flash"):
        self.key = config.get('google_api_key')
        genai.configure(api_key=self.key)
        self.model = genai.GenerativeModel(model)

        # self.model = "gemini-1.5-pro"
        # todo set it in env variable or any other way
        

        self.input_prompt ="""
        ### As a skilled Application Tracking System (ATS) with advanced knowledge in technology and data science, your role is to meticulously evaluate a candidate's resume based on the provided job description.

        ### Your evaluation will involve analyzing the resume for relevant skills, experiences, and qualifications that align with the job requirements. Look for key buzzwords and specific criteria outlined in the job description to determine the candidate's suitability for the position.

        ### Provide a detailed assessment of how well the resume matches the job requirements, highlighting strengths, weaknesses, and any potential areas of concern. Offer constructive feedback on how the candidate can enhance their resume to better align with the job description and improve their chances of securing the position.

        ### Your evaluation should be thorough, precise, and objective, ensuring that the most qualified candidates are accurately identified based on their resume content in relation to the job criteria.

        ### Remember to utilize your expertise in technology and data science to conduct a comprehensive evaluation that optimizes the recruitment process for the hiring company. Your insights will play a crucial role in determining the candidate's compatibility with the job role.
        resume={resume}

        jd={jd}

        ### Evaluation Output:
        1. Calculate the percentage of match between the resume and the job description. Give a number and some explation
        2. Identify any key keywords that are missing from the resume in comparison to the job description.
        3. Offer specific and actionable tips to enhance the resume and improve its alignment with the job requirements.

        You must respond as a JSON object with the following structure:

        {{
        "result": {{
            "match_percentage": "<percentage>",
            "missing_keywords": [ <keyword1>, <keyword2>  ],
            "All_keywords_in_jd": [ <keyword1>, <keyword2>  ],
            "All_keywords_in_resume": [ <keyword1>, <keyword2>  ],
            "explanation": "<explanation>",
            "enhancement_tips": [ <tip1>, <tip2>  ],
        }}}}

        """

    def job_similarity_score(self, job_desc, resume,  verbose = False):
        jsonRes = ""
        try:
            

            input = self.input_prompt.format(resume=resume, jd=job_desc)
            if verbose == True:
                logging.info(input)

            response = self.model.generate_content(input)

            if verbose == True:
                logging.info(response)

            response_text = response.text.replace("```json", '')
            response_text = response_text.replace("```", '')
            jsonRes = json.loads(response_text)


            # Convert the JSON String to a dictionary
        except :
            logging.error("some error occurred")

        return jsonRes

    

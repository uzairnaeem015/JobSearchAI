import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from gensim.models.doc2vec import Doc2Vec, TaggedDocument

from numpy.linalg import norm

import google.generativeai as genai
from google.api_core.exceptions import InvalidArgument

import json
import logging
import os

API_KEY = os.environ.get("API_KEY_GOOGLE")

if not API_KEY:
    try:
        with open("config.json") as config_file:
            config = json.load(config_file)
        API_KEY = config.get("API_KEY_GOOGLE")
    except FileNotFoundError:
        raise Exception("API key not found in environment variables or config file")


# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Sentence_Transformer:
    def __init__(self):
        # Load pre-trained BERT model for sentence embeddings
        self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    def check_similarity(self, resume_text, job_desc):
        # Sample sentences
        sentences = [resume_text, job_desc]

        # Generate embeddings
        embeddings = self.model.encode(sentences)

        # Calculate cosine similarity
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])
        return round(similarity[0][0]*100,2)
        

class CountAndTdfVector:
    def __init__(self):
        self.use_stop_words = False
    
    def count_vectorize_similarity(self, resume_text, job_desc):
        documents = [resume_text, job_desc]

        count_vectorizer = CountVectorizer()
        
        if self.use_stop_words == True:
            count_vectorizer = CountVectorizer(stop_words="english")
        
        sparse_matrix = count_vectorizer.fit_transform(documents)
        
        doc_term_matrix = sparse_matrix.todense()
        df = pd.DataFrame(
        doc_term_matrix,
        columns=count_vectorizer.get_feature_names_out(),
        index=["resume_text", "job_desc"],
        )
        res = cosine_similarity(df, df)
        return round(res[0][1]*100,2)
    

    def tfidf_similarity(self, resume_text, job_desc):
        vectorizer = TfidfVectorizer()

        if self.use_stop_words == True:
            vectorizer = TfidfVectorizer(stop_words="english")

        tfidf_matrix = vectorizer.fit_transform([resume_text, job_desc])

        # Calculate cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix)

        return round(cosine_sim[0][1]*100,2)


class Doc2VecGensim:
    # https://github.com/kirudang/CV-Job-matching/tree/main
    # https://medium.com/@kirudang/job-resume-matching-part-1-2-obtaining-similarity-score-using-doc2vec-a6d07fe3b355
    def __init__(self, model_path = '../models/cv_job_maching.model'):
        self.model = Doc2Vec.load(model_path)



    def check_similarity(self, resume_text, job_desc):

        v1 = self.model.infer_vector(resume_text.split()) # Input of CV
        v2 = self.model.infer_vector(job_desc.split()) # Input of JD
        similarity = 100*(np.dot(np.array(v1), np.array(v2))) / (norm(np.array(v1)) * norm(np.array(v2)))
        logging.info(round(similarity, 2))
        return round(similarity, 2)
    

class GoogleGemini:
    def __init__(self, model = "gemini-1.5-flash", api_key_param = ""):
        if  api_key_param is not None and api_key_param != "":
            genai.configure(api_key=api_key_param)
        else:
            genai.configure(api_key=API_KEY)
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
        4. Identify "Summary", "work history", and "project related descriptions" only and analyze with job description, also give a percentage score on each, and provide an optimized version that matches job description.

        You must respond as a JSON object with the following structure:

        {{
        "result": {{
            "match_percentage": "<percentage>",
            "missing_keywords": [ <keyword1>, <keyword2>  ],
            "All_keywords_in_jd": [ <keyword1>, <keyword2>  ],
            "All_keywords_in_resume": [ <keyword1>, <keyword2>  ],
            "explanation": "<explanation>",
            "enhancement_tips": [ <tip1>, <tip2>  ],
            "Analysis" : [ {{"original_line" : <line>, "optimized_line" : <optimizedline>, "line_score" : <score>,  }} ]
        }}}}
        """

    def job_similarity_score(self, job_desc, resume,  verbose = False):
        jsonRes = ""
        try:
            
            response = ""
            input = self.input_prompt.format(resume=resume, jd=job_desc)
            if verbose == True:
                logging.info(input)

            response = self.model.generate_content(input)

            if verbose == True:
                logging.info(response)

            response_text = response.text.replace("```json", '')
            response_text = response_text.replace("```", '')
            jsonRes = json.loads(response_text)

        except InvalidArgument as e:
            logging.error(f"Invalid API key provided: {e}")
            return "Invalid API key. Please pass a valid API key."
            # Convert the JSON String to a dictionary
        except :
            logging.error(response)
            logging.error("some error occurred")

        return jsonRes

    

from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import re
import pandas as pd
import numpy as np
from numpy.linalg import norm

import logging

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
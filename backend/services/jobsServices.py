import logging
import pandas as pd
from services.JobScanAIModels import Doc2VecGensim, Sentence_Transformer, CountAndTdfVector
from Helper.TextHelper import TextPreprocessor

# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from services.DBService import MongoDB

class ScrapeJobs:
    def __init__(self, title, location, page_size, site, hours_old):
        self.title = title
        self.location = location
        self.page_size = page_size
        self.hours_old = hours_old
        self.site = site

        self.mongoDB = MongoDB()
    
    def retrieve_jobs(self, resume_content, scrape_latest_jobs, last_id , remove_stopwords = False,  verbose = False):
       
        from jobspy import scrape_jobs

        # logger.info(f"search_term {self.title}, location {self.location}")
        if verbose:
            logger.info(f"Resume {resume_content}")

        fetch_linkedin_description = False;

        if self.site == '' or self.site == 'All': 
            self.site = ["linkedin", "glassdoor", "indeed"]
            fetch_linkedin_description = True
        elif self.site == 'LinkedIn':
            fetch_linkedin_description = True
        
        logger.info(f"scrape_latest_jobs {scrape_latest_jobs}")
        if scrape_latest_jobs is None:
            scrape_latest_jobs = False
            
        
        jobs = pd.DataFrame()

        if(scrape_latest_jobs == True):

            jobs = scrape_jobs(
                site_name= self.site, # "linkedin", "glassdoor", "indeed", "zip_recruiter"
                search_term= self.title,
                location= self.location,
                results_wanted=self.page_size,
                hours_old= self.hours_old, # (only Linkedin/Indeed is hour specific, others round up to days old)
                country_indeed='USA',  # only needed for indeed / glassdoor
                description_format= "html",
                linkedin_fetch_description = fetch_linkedin_description # get full description , direct job url , company industry and job level (seniority level) for linkedin (slower)
                # proxies=["208.195.175.46:65095", "208.195.175.45:65095", "localhost"],
                
            )
            jobs = jobs.fillna('')

            logger.info(f"Jobs found in web scrapping {len(jobs)}")

            self.mongoDB.insert_jobs(jobs)

            row_count = len(jobs)
            listofzeroes = ["0"] * row_count
            jobs['orgid'] = listofzeroes

        else:
            jobs = self.mongoDB.fetch_jobs(jobs, self.title, self.site, self.location, last_id)

        
        
        if resume_content:
            Doc2VecGensim_model = Doc2VecGensim('./models/cv_job_maching.model')
            sentenceTransformer_model = Sentence_Transformer()
            CountAndTdfVector_model = CountAndTdfVector()

            text_Preprocessor = TextPreprocessor()

            resume_text_pre = text_Preprocessor.text_preprocess(resume_content)
            if remove_stopwords:
                resume_text_pre_processed = text_Preprocessor.remove_stopwords(resume_text_pre)
            else:
                resume_text_pre_processed = resume_text_pre


            matched_keywords = text_Preprocessor.find_keywords_in_document(list(self.mongoDB.get_skill_keywords_set), resume_content)
            

            similarity_Doc2VecGensim_model = [] 
            similarity_sentenceTransformer_model = [] 
            similarity_CountVector_model = [] 
            similarity_TdfVector_model = [] 
            similarity_matched_keywords = [] 
            similarity_matched_keywords_cosine  = []

            # Iterate through each row and calculate the new column value
            for index, row in jobs.iterrows():
                job_desc =  row['description']
                job_desc_pre = text_Preprocessor.text_preprocess(job_desc)
                job_desc_pre_processed = text_Preprocessor.remove_stopwords(job_desc_pre)

                sim_score_1 = Doc2VecGensim_model.check_similarity(resume_text_pre_processed, job_desc_pre_processed) 
                similarity_Doc2VecGensim_model.append(sim_score_1)

                sim_score_2 = sentenceTransformer_model.check_similarity(resume_text_pre_processed, job_desc_pre_processed) 
                similarity_sentenceTransformer_model.append(sim_score_2)

                sim_score_3 = CountAndTdfVector_model.count_vectorize_similarity(resume_text_pre_processed, job_desc_pre_processed) 
                similarity_CountVector_model.append(sim_score_3)

                sim_score_4 = CountAndTdfVector_model.tfidf_similarity(resume_text_pre_processed, job_desc_pre_processed) 
                similarity_TdfVector_model.append(sim_score_4)

                matched_keywords_jd = text_Preprocessor.find_keywords_in_document(list(self.mongoDB.get_skill_keywords_set), job_desc)
                sim_score_5 = CountAndTdfVector_model.calculate_similarity_percentage(matched_keywords_jd, matched_keywords) 
                similarity_matched_keywords.append(sim_score_5)

                sim_score_6 = CountAndTdfVector_model.cosine_similarity(matched_keywords_jd, matched_keywords) 
                similarity_matched_keywords_cosine.append(sim_score_6)
        
            jobs['Similarity_score_Gensim'] = similarity_Doc2VecGensim_model
            jobs['similarity_sentenceTransformer'] = similarity_sentenceTransformer_model
            jobs['similarity_CountVector'] = similarity_CountVector_model
            jobs['similarity_TdfVector'] = similarity_TdfVector_model
            jobs['similarity_matched_keywords'] = similarity_matched_keywords 
            jobs['similarity_matched_keywords_cosine'] = similarity_matched_keywords_cosine 
        else:
            row_count = len(jobs)
            listofzeroes = [0] * row_count
            jobs['Similarity_score_Gensim'] = listofzeroes
            jobs['similarity_sentenceTransformer'] = listofzeroes
            jobs['similarity_CountVector'] = listofzeroes
            jobs['similarity_TdfVector'] = listofzeroes
            jobs['similarity_matched_keywords'] = listofzeroes
            jobs['similarity_matched_keywords_cosine'] = listofzeroes 



        logger.info(f"Found {len(jobs)} jobs")
        if verbose:
            logger.info(jobs.head())

        # result = jobs.to_json(orient="table")

        result = jobs.to_dict(orient="records")

        return result
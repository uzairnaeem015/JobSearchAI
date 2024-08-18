import logging

from services.JobScanAIModels import Doc2VecGensim, Sentence_Transformer, CountAndTdfVector
from Helper.TextHelper import TextPreprocessor

# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ScrapeJobs:
    def __init__(self, title, location, page_size, site, hours_old):
        self.title = title
        self.location = location
        self.page_size = page_size
        self.hours_old = hours_old
        self.site = site
    
    def retrieve_jobs(self, resume_content, verbose = False):
       
        from jobspy import scrape_jobs

        # logger.info(f"search_term {self.title}, location {self.location}")

        fetch_linkedin_description = False;

        if self.site == '' or self.site == 'All': 
            self.site = ["linkedin", "glassdoor", "indeed"]
            fetch_linkedin_description = True
        elif self.site == 'LinkedIn':
            fetch_linkedin_description = True
        
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

        Doc2VecGensim_model = Doc2VecGensim('./models/cv_job_maching.model')
        sentenceTransformer_model = Sentence_Transformer()
        CountAndTdfVector_model = CountAndTdfVector()

        text_Preprocessor = TextPreprocessor()

        resume_text_pre = text_Preprocessor.text_preprocess(resume_content)
        resume_text_pre_processed = text_Preprocessor.remove_stopwords(resume_text_pre)

        similarity_Doc2VecGensim_model = [] 
        similarity_sentenceTransformer_model = [] 
        similarity_CountVector_model = [] 
        similarity_TdfVector_model = [] 

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
        
        jobs['Similarity_score_Gensim'] = similarity_Doc2VecGensim_model
        jobs['similarity_sentenceTransformer'] = similarity_sentenceTransformer_model
        jobs['similarity_CountVector'] = similarity_CountVector_model
        jobs['similarity_TdfVector'] = similarity_TdfVector_model

        logger.info(f"Found {len(jobs)} jobs")
        logger.info(jobs.head())

        # result = jobs.to_json(orient="table")

        result = jobs.to_dict(orient="records")
        # jobs.to_csv("jobs.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False) # to_excel
        return result
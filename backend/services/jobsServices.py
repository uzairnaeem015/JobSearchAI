import logging

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
    
    def retrieve_jobs(self, verbose = False):
       
        from jobspy import scrape_jobs
        import csv

        logger.info(f"search_term {self.title}, location {self.location}")

        fetch_linkedin_description = False;

        if self.site == '': 
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

            linkedin_fetch_description = fetch_linkedin_description # get full description , direct job url , company industry and job level (seniority level) for linkedin (slower)
            # proxies=["208.195.175.46:65095", "208.195.175.45:65095", "localhost"],
            
        )
        jobs = jobs.fillna('')
        logger.info(f"Found {len(jobs)} jobs")
        logger.info(jobs.head())

        result = jobs.to_json(orient="table")
        # jobs.to_csv("jobs.csv", quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False) # to_excel
        return result
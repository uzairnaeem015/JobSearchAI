import logging

# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LinkedInService:
    def __init__(self, title):
        self.title = title
    
    def retrieve_jobs(self, verbose = False):
        self.title = self.title + "123 "
        return self.title
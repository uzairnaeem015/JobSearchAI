import logging
import PyPDF2

# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDF:
    def __init__(self, path = 'C:\\Users\\uzair\\OneDrive\\Desktop\\CV\\July 2024\\Uzair Naeem.pdf'):
        self.path = path


    def getResumeContent(self, path):
        self.path = path
        pdf = PyPDF2.PdfReader(self.path)
        resume = ""
        for i in range(len(pdf.pages)):
            pageObj = pdf.pages[i]
            resume += pageObj.extract_text()

        return resume
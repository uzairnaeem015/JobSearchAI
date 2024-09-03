import logging
import PyPDF2


# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDF:
    def __init__(self):
        self.init = True


    def getResumeContent(self, path):
        pdf = PyPDF2.PdfReader(path)
        resume = ""
        for i in range(len(pdf.pages)):
            pageObj = pdf.pages[i]
            resume += pageObj.extract_text()

        return resume
    
    def readPDFContent(self, file):
    # Read the PDF content
        pdf_reader = PyPDF2.PdfReader(file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text()
        return text_content
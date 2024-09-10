import nltk
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


class TextPreprocessor:
    def __init__(self):
        nltk.download('punkt')
        nltk.download('stopwords')
        nltk.download('wordnet')
        nltk.download('punkt_tab')
        self.stop_words = set(stopwords.words('english'))

    def text_preprocess(self, text):
        text = text.lower()

        # Step 2: Remove special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        text = text.replace('\n', ' ')               # Remove newline characters

        return text
    
    # Function to remove stopwords
    def remove_stopwords(self, text):
        words = word_tokenize(text)
        filtered_sentence = ' '.join([word for word in words if word.lower() not in self.stop_words])
        return filtered_sentence
    

    def find_keywords_in_document(keywords, document_text):
        # Convert the document text to lowercase for case-insensitive matching
        document_text = document_text.lower()

        # Initialize an empty list for storing matching keywords
        matching_keywords = []

        # Loop through each keyword and check for exact word/phrase matches
        for keyword in keywords:
            # Use regex to find exact matches for the keyword
            # The \b ensures that the keyword is a whole word or phrase
            pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
            
            # If the keyword is found in the document, add it to the matching list
            if re.search(pattern, document_text):
                matching_keywords.append(keyword)

        return matching_keywords
    
    
    
    # def preprocess_text(self, text):
    #     # Convert the text to lowercase
    #     text = text.lower()
        
    #     # Remove punctuation from the text
    #     text = re.sub('[^a-z]', ' ', text)
        
    #     # Remove numerical values from the text
    #     text = re.sub(r'\d+', '', text)
        
    #     # Remove extra whitespaces
    #     text = ' '.join(text.split())
        
    #     return text
    
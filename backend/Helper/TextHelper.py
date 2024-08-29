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
    
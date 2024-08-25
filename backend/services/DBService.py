import logging
import os
import json
from dotenv import load_dotenv
import pandas as pd

# Load environment variables from .env file
load_dotenv()

# configure logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import errors

uri = os.environ.get("MONGO_DB_URI")
db_name = os.environ.get("MONGO_DB_NAME")

if not uri:
    try:
        with open("config.json") as config_file:
            config = json.load(config_file)
        API_KEY = config.get("MONGO_DB_URI")
    except FileNotFoundError:
        raise Exception("MONGO_DB_URI not found in environment variables or config file")


from bson.objectid import ObjectId

last_id = ObjectId("000000000000000000000000")


class MongoDB:
    def __init__(self):
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        
        try:
            self.db = self.client[db_name]
            self.client.admin.command('ping')
            logging.info("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            logging.error(e)
            raise e
        

    def insert_new_user(self, name, username, email):
        collection = self.db['users']

        # Example: Insert a document into the collection
        document = {"name": name, "username": username, "email": email}
        collection.insert_one(document)

        result = collection.find_one({"email": email})

        return result
    

    def fetch_jobs(self, jobs_df, title, site, location, last_id_param = "0"):
        try:
            collection = self.db['jobs']
            pipeline = []

            if site == '' or site == 'All': 
                site = "indeed linkedin glassdoor"

            if last_id_param is not None or last_id_param != "0":
                last_id = ObjectId(last_id_param)

            pipeline = [
                {
                    "$search": {
                        "index": "title",  # Name of your Atlas Search index
                        "compound": {
                            "must": [
                                {
                                    "text": {
                                        "query": title,
                                        "path": ["description", "title"]  # Fields to search
                                    }
                                },
                                {
                                    "text": {
                                        "query": location,
                                        "path": ["location"]  # Fields to search
                                    }
                                },
                                {
                                    "text": {
                                        "query": site,
                                        "path": ["site"]  # Fields to search
                                    }
                                }
                            ]                
                        }
                    }
                },
                {
                    "$match": {
                        "_id": {"$lt": last_id}  # Match documents with _id greater than the specified id
                    }
                },
                {
                    "$sort": {
                        "_id": -1  # Sort documents by created_at in descending order
                    }
                },
                {
                    "$limit": 10  # Limit the number of results
                }
            ]


            results = collection.aggregate(pipeline)
            
            docs_list = list(results)

            # Convert the list of dictionaries to a pandas DataFrame
            df = pd.DataFrame(docs_list)
            #print(len(df))
            df['orgid'] = df['_id'].astype(str)

            # Drop the original '_id' column
            df = df.drop(columns=['_id'])

            return df

        except Exception as e:
            logging.error(e)
            return jobs_df

    def insert_jobs(self, jobs_df):
        try:
            collection = self.db['jobs']
            jobs_df['date_posted'] = pd.to_datetime(jobs_df['date_posted'])

            from datetime import datetime
            current_datetime = datetime.now()
            # Handle NaT values (e.g., fill with a specific date)
            jobs_df['date_posted'].fillna(pd.Timestamp(current_datetime), inplace=True)

            # Now you can safely perform datetime operations
            jobs_df['date_posted'] = jobs_df['date_posted'].dt.tz_localize('UTC')

            # Example: Insert a document into the collection
            documents = jobs_df.to_dict(orient="records")
            collection.insert_many(documents, ordered=False)
            
        except errors.BulkWriteError as e:
            logging.error("Handled duplicate insertion")
        except Exception as e:
            logging.error(e)
            raise   e

        

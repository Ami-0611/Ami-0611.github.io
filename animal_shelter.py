import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
from bson.objectid import ObjectId
from dotenv import load_dotenv

class AnimalShelter(object):
    """ CRUD operations for Animal collection in MongoDB """

    def __init__(self, username, password):
        # Load environment variables from the .env file
        load_dotenv()
        HOST = os.getenv("MONGO_HOST")
        PORT = int(os.getenv("MONGO_PORT"))
        DB = os.getenv("MONGO_DB")
        COL = os.getenv("MONGO_COL")

        try:
            self.client = MongoClient(f'mongodb://{username}:{password}@{HOST}:{PORT}/?authSource={DB}')
            self.database = self.client[DB]
            self.collection = self.database[COL]
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")
        except OperationFailure as e:
            print(f"Authentication failed: {e}")

    def create(self, data):
        if data:
            try:
                self.collection.insert_one(data)
                return True
            except Exception as e:
                print(f"Error inserting document: {e}")
                return False
        else:
            raise ValueError("No data provided for insertion")

    def read(self, query):
        try:
            if "_id" in query and isinstance(query["_id"], str):
                query["_id"] = ObjectId(query["_id"])
            return list(self.collection.find(query))
        except Exception as e:
            print(f"Error reading documents: {e}")
            return []
        
    def update(self, query, new_values):
        try:
            if "_id" in query and isinstance(query["_id"], str):
                query["_id"] = ObjectId(query["_id"])
            result = self.collection.update_many(query, new_values)
            return result.modified_count
        except Exception as e:
            print(f"Error updating documents: {e}")
            return 0

    def delete(self, query):
        try:
            if "_id" in query and isinstance(query["_id"], str):
                query["_id"] = ObjectId(query["_id"])
            result = self.collection.delete_many(query)
            return result.deleted_count
        except Exception as e:
            print(f"Error deleting documents: {e}")
            return 0

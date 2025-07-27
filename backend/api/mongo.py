import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_collection(name):
    host = os.getenv("MONGO_HOST")
    port = int(os.getenv("MONGO_PORT"))
    db_name = os.getenv("MONGO_DB")
    col_name = os.getenv("MONGO_COL")collection.find
    username = os.getenv("MONGO_USERNAME")
    password = os.getenv("MONGO_PASSWORD")

    client = MongoClient(f"mongodb://{username}:{password}@{host}:{port}/?authSource={db_name}")
    db = client[db_name]
    return db[col_name]

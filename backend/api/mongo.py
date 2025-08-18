import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_collection(name):
    host = os.getenv("MONGO_HOST")
    port = int(os.getenv("MONGO_PORT"))
    db_name = os.getenv("MONGO_DB")
    username = os.getenv("MONGO_USERNAME")
    password = os.getenv("MONGO_PASSWORD")

    client = MongoClient(f"mongodb://{username}:{password}@{host}:{port}/?authSource=AAC")
    print(f"Connecting to mongodb://{host}:{port}, DB: {db_name}, Collection: {name}")
    db = client[db_name]
    return db[name]

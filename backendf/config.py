# config.py
import os
from dotenv import load_dotenv
from mongoengine import connect

load_dotenv()                                    # read .env

PORT         = int(os.getenv("PORT", 5000))
MONGODB_URI  = os.getenv(
    "MONGODB_URI",
    "mongodb://127.0.0.1:27017/productCatalogDB",
)
JWT_SECRET   = os.getenv("JWT_SECRET", "secret123")


def init_db() -> None:
    """Connect MongoEngine to MongoDB once at app start-up."""
    connect(host=MONGODB_URI)                    # raises on failure

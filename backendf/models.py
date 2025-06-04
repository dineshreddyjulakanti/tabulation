# models.py
import uuid
from mongoengine import Document, fields, StringField, BooleanField, FloatField

class User(Document):
    meta = {"collection": "user"}
    id       = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    username = StringField(required=True, unique=True)
    password = StringField(required=True)            # hashed
    role     = StringField(required=True, choices=("admin", "consumer"))

class Product(Document):
    meta = {"collection": "products"}  # Changed from "product" to "products" to match your DB
    id       = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    name     = StringField(required=True)
    price    = FloatField(required=True)
    category = StringField()
    inStock  = BooleanField()

class Profile(Document):
    meta = {"collection": "profile"}
    id           = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    name         = StringField()
    email        = StringField()
    phone        = StringField()
    degree       = StringField()
    institution  = StringField()
    year         = StringField()
    interests    = fields.ListField(StringField())
    achievements = fields.ListField(StringField())
    createdAt    = fields.DateTimeField(auto_now_add=True)

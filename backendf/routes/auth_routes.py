# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from models import User
from config import JWT_SECRET
import bcrypt, jwt, datetime

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@bp.post("/register")
def register():
    data = request.get_json(force=True)
    try:
        hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()
        User(username=data["username"], password=hashed, role=data["role"]).save()
        return jsonify({"message": "Registration successful. You can now login."})
    except Exception as e:
        return jsonify({"message": "Registration failed: " + str(e)}), 400

@bp.post("/login")
def login():
    data = request.get_json(force=True)
    user = User.objects(username=data["username"]).first()
    if not user:
        return jsonify({"message": "Login failed."}), 401
    if not bcrypt.checkpw(data["password"].encode(), user.password.encode()):
        return jsonify({"message": "Login failed."}), 401

    payload = {
        "userId": str(user.id),
        "role": user.role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return jsonify({"token": token, "role": user.role})

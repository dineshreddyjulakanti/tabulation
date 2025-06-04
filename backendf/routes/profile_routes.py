# routes/profile_routes.py
from flask import Blueprint, request, jsonify
from models import Profile

bp = Blueprint("profiles", __name__, url_prefix="/api/profiles")

@bp.post("/")
def create_profile():
    try:
        p = Profile(**request.get_json(force=True)).save()
        return jsonify(p.to_mongo().to_dict() | {"id": str(p.id)}), 201
    except:
        return jsonify({"error": "Failed to create profile"}), 400

@bp.get("/")
def list_profiles():
    profs = Profile.objects.order_by("-createdAt")
    return jsonify([p.to_mongo().to_dict() | {"id": str(p.id)} for p in profs])

@bp.get("/<pid>")
def get_profile(pid):
    p = Profile.objects(id=pid).first()
    return (jsonify(p.to_mongo().to_dict() | {"id": pid}) if p
            else (jsonify({"error": "Not found"}), 404))

# auth.py
import functools, jwt
from flask import request, jsonify
from config import JWT_SECRET

def token_required(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "")
        
        # Debug log
        print(f"Auth header received: '{token}'")
        
        if token.startswith("Bearer "):
            token = token[7:]
        
        if not token:
            return jsonify({"message": "Access denied. No token provided."}), 401
            
        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = decoded                 # attach user info
            print(f"Decoded token: {decoded}")
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired. Please login again."}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"message": f"Invalid token: {str(e)}"}), 400
        except Exception as e:
            return jsonify({"message": f"Token validation error: {str(e)}"}), 400
            
        return f(*args, **kwargs)
    return wrapper

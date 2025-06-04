# # app.py
# from flask import Flask, jsonify
# from flask_cors import CORS
# import config
# from config import init_db
# from routes.auth_routes import bp as auth_bp
# from routes.product_routes import bp as product_bp
# from routes.profile_routes import bp as profile_bp
# from mongoengine import ValidationError

# def create_app():
#     app = Flask(__name__)
#     CORS(app)
#     init_db()

#     # health-check
#     @app.get("/api/health")
#     def health():
#         return jsonify({"status": "ok"})

#     # register blueprints
#     app.register_blueprint(auth_bp)
#     app.register_blueprint(product_bp)
#     app.register_blueprint(profile_bp)

#     # global error handlers
#     @app.errorhandler(404)
#     def not_found(e): return jsonify({"message": "❌ Path not found"}), 404

#     @app.errorhandler(ValidationError)
#     def bad_request(e): return jsonify({"message": str(e)}), 400

#     @app.errorhandler(Exception)
#     def server_error(e):
#         app.logger.exception(e)
#         return jsonify({"message": "Server error"}), 500

#     return app

# if __name__ == "__main__":
#     create_app().run(port=config.PORT, debug=True)
# app.py
import config
from flask import Flask, jsonify
from flask_cors import CORS
from mongoengine import ValidationError
from config import init_db
from routes.auth_routes import bp as auth_bp
from routes.product_routes import bp as product_bp
from routes.profile_routes import bp as profile_bp


def create_app() -> Flask:
    app = Flask(__name__)

    # Allow the React dev server (http://localhost:3000) to call any /api/* route
    # CORS(app, resources={r"/api/*": {"origins": "*"}})
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    init_db()

    # ---------------- health-check ----------------
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # ---------------- blueprints ------------------
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(profile_bp)

    # --------------- error handlers --------------
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "❌ Path not found"}), 404

    @app.errorhandler(ValidationError)
    def bad_request(e):
        return jsonify({"message": str(e)}), 400

    @app.errorhandler(Exception)
    def server_error(e):
        app.logger.exception(e)
        return jsonify({"message": "Server error"}), 500

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=config.PORT, debug=True)

# Instead of hardcoding:
# axios.get('http://localhost:5000/api/profiles')
# Use:
# axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/profiles`)

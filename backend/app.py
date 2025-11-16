from flask import Flask, jsonify
from flask_cors import CORS

from backend.blueprints.exercises import exercises_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(exercises_bp, url_prefix="/api")

    @app.get("/api/health")
    def healthcheck():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

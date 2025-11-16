from random import choice

from flask import Blueprint, jsonify, request

from backend.data.exercises import EXERCISES


exercises_bp = Blueprint("exercises", __name__)


@exercises_bp.get("/exercises")
def get_exercises():
    age = request.args.get("age")
    goal = request.args.get("goal")

    if not age or not goal:
        return jsonify({"error": "Parâmetros 'age' e 'goal' são obrigatórios."}), 400

    age_group = EXERCISES.get(age)
    if age_group is None:
        return jsonify({"error": f"Faixa etária '{age}' não encontrada."}), 404

    exercises = age_group.get(goal)
    if exercises is None:
        return jsonify({"error": f"Objetivo '{goal}' não encontrado para '{age}'."}), 404

    return jsonify({"age": age, "goal": goal, "exercises": exercises})


@exercises_bp.get("/exercises/random")
def get_random_exercise():
    age = request.args.get("age")
    goal = request.args.get("goal")

    if not age or not goal:
        return jsonify({"error": "Parâmetros 'age' e 'goal' são obrigatórios."}), 400

    age_group = EXERCISES.get(age)
    if age_group is None:
        return jsonify({"error": f"Faixa etária '{age}' não encontrada."}), 404

    exercises = age_group.get(goal)
    if exercises is None:
        return jsonify({"error": f"Objetivo '{goal}' não encontrado para '{age}'."}), 404

    return jsonify({
        "age": age,
        "goal": goal,
        "exercise": choice(exercises),
    })


@exercises_bp.get("/exercises/options")
def get_options():
    return jsonify({"age_groups": sorted(EXERCISES.keys())})

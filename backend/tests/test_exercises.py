import pytest

from backend.app import create_app
from backend.data.exercises import EXERCISES


@pytest.fixture
def client():
    app = create_app()
    app.config.update(TESTING=True)
    with app.test_client() as client:
        yield client


def test_healthcheck(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_get_exercises_success(client):
    response = client.get(
        "/api/exercises", query_string={"age": "adultos", "goal": "bem-estar"}
    )
    data = response.get_json()

    assert response.status_code == 200
    assert data["age"] == "adultos"
    assert data["goal"] == "bem-estar"
    assert len(data["exercises"]) > 0


def test_get_exercises_invalid_age(client):
    response = client.get(
        "/api/exercises", query_string={"age": "alien", "goal": "bem-estar"}
    )
    assert response.status_code == 404
    assert "não encontrada" in response.get_json()["error"]


def test_random_exercise(client):
    response = client.get(
        "/api/exercises/random", query_string={"age": "criancas", "goal": "perder-peso"}
    )
    data = response.get_json()

    assert response.status_code == 200
    assert data["age"] == "criancas"
    assert data["goal"] == "perder-peso"
    assert isinstance(data["exercise"], str)
    assert data["exercise"] in EXERCISES["criancas"]["perder-peso"]

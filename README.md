This is a simple project for my college!

It is the prototype (not final/real product) of a fitness website, it takes your age and, your objective and gives you a list of
 exercises you should do according to both age and objective

It was made with html, css and js (since it is a prototype and not the final product)

## Backend Flask API

The exercise suggestions are now served by a lightweight Flask API located in `backend/`.

### Ambiente virtual

```
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate  # Windows PowerShell
pip install -r backend/requirements.txt
```

### Executar servidor

Com o ambiente ativo:

```
export FLASK_APP=backend.app:create_app
flask run --app backend.app:create_app --debug
```

Ou use o helper script:

```
./backend/run.sh
```

### Endpoints principais

- `GET /api/health`: verificação simples de status.
- `GET /api/exercises?age=<faixa>&goal=<objetivo>`: retorna a lista de exercícios para a combinação informada.
- `GET /api/exercises/random?age=<faixa>&goal=<objetivo>`: retorna um exercício aleatório.

### Testes

Os testes básicos do backend podem ser executados com:

```
pytest backend/tests
```

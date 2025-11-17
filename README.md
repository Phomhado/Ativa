# Ativa

Protótipo de um site fitness com frontend em Next.js e uma API Flask que entrega sugestões de exercícios a partir da faixa etária e do objetivo informado.

## Visão geral
- **Frontend**: Next.js 14 (TypeScript) localizado em `frontend/`.
- **Backend**: Flask com blueprints em `backend/`, exposto em `/api`.
- **Envio de dados**: o frontend consulta `GET /api/exercises` e `GET /api/exercises/random` para montar a lista de treinos.

## Requisitos
- Node.js 18+ e npm para o frontend.
- Python 3.10+ para o backend.

## Backend Flask
### Instalação
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate  # Windows PowerShell
pip install -r backend/requirements.txt
```

### Execução em desenvolvimento
Com o ambiente ativo:
```bash
export FLASK_APP=backend.app:create_app
flask run --app backend.app:create_app --debug
```
Ou use o helper script:
```bash
./backend/run.sh
```

### Endpoints principais
- `GET /api/health`: verificação simples de status.
- `GET /api/exercises?age=<faixa>&goal=<objetivo>`: retorna a lista de exercícios para a combinação informada.
- `GET /api/exercises/random?age=<faixa>&goal=<objetivo>`: retorna um exercício aleatório.

### Testes do backend
```bash
pytest backend/tests
```

## Frontend Next.js
### Instalação
```bash
cd frontend
npm install
```

### Variáveis de ambiente (`frontend/.env.local`)
Copie o exemplo e ajuste URLs conforme o ambiente:
```bash
cp frontend/.env.local.example frontend/.env.local
```
Valores padrão sugeridos:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_HEALTH_URL=http://localhost:5000/api/health
```
Caso não configure, o frontend usa automaticamente `http://localhost:5000/api` como base.

### Execução em desenvolvimento
```bash
cd frontend
npm run dev
```
O app ficará disponível em `http://localhost:3000`.

### Build e execução de produção
```bash
cd frontend
npm run build
npm run start
```

### Testes/Lint do frontend
```bash
cd frontend
npm run lint
```

## Como rodar a aplicação completa
1. Suba o backend Flask (com o virtualenv ativo): `flask run --app backend.app:create_app --debug`.
2. Em outro terminal, dentro de `frontend/`, inicie o Next.js com `npm run dev`.
3. Acesse `http://localhost:3000`, escolha a faixa etária e objetivo para ver as sugestões vindas da API.

## Como gravar e reproduzir a demo
1. Certifique-se de que backend (porta 5000) e frontend (porta 3000) estão rodando com as variáveis em `.env.local` apontando para a API.
2. Use seu gravador de tela preferido (OBS, QuickTime, Xbox Game Bar) e capture ao menos 1080p/30fps.
3. No vídeo, navegue pela UI e deixe o DevTools aberto na aba *Network* para mostrar as chamadas a `/api/exercises`.
4. Salve o arquivo (`demo.mp4` sugerido) e compartilhe com o time. Para reproduzir, basta abrir o vídeo e seguir os passos de execução acima para replicar a navegação.

## Roteiro para um vídeo (≥5 minutos)
1. **Overview (≈1 min)**: apresente o objetivo do protótipo, tecnologias usadas e fluxo geral usuário → API.
2. **Instalação (≈1 min)**: demonstre a criação do virtualenv, `pip install -r backend/requirements.txt`, `npm install` e configuração do `.env.local`.
3. **Execução (≈1 min)**: mostre a subida do backend (`flask run ...`) e do frontend (`npm run dev`), confirmando `http://localhost:3000` no navegador.
4. **Navegação da UI (≈1.5 min)**: percorra os campos de idade/objetivo, mostre a lista de exercícios e as mensagens de fallback quando aplicável.
5. **Chamada aos endpoints (≈0.5–1 min)**: abra o DevTools, filtre por `exercises` e mostre a resposta JSON de `/api/exercises` e `/api/exercises/random`.
6. **Encerramento (≈0.5 min)**: recapitule comandos de build (`npm run build && npm run start`) e onde rodar os testes (`pytest backend/tests`, `npm run lint`).

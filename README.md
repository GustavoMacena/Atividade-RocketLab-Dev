# Rocketlab 2026 - Guia Completo de Execucao

Este repositorio contem:

- `backend`: API FastAPI com SQLite
- `frontend`: Aplicacao React + TypeScript

## Requisitos

- Python 3.11+
- Node.js 20+
- pnpm 9+

## 1) Subir o Backend

Abra um terminal na raiz do repositorio e execute:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python scripts/populate_from_csv.py
python -m app.main
```

Ao final:

- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

## 2) Subir o Frontend

Abra um segundo terminal na raiz do repositorio e execute:

```bash
cd frontend
pnpm install
pnpm dev
```

Ao final:

- App web: http://localhost:5173

## 3) Como o Frontend conversa com a API

O frontend usa `VITE_API_BASE_URL=/api` por padrao e o Vite faz proxy para `http://localhost:8000`.

Resumo:

- Front chama `/api/...`
- Vite reescreve para `http://localhost:8000/...`

## 4) Fluxo de Verificacao Rapida

Com backend e frontend rodando:

1. Abra `http://localhost:5173` e valide o catalogo.
2. Abra um produto e valide a tela de detalhe.
3. Teste criar produto pelo cabecalho.
4. Teste atualizar e remover no detalhe do produto.
5. Confira filtros no catalogo (categoria, avaliacao e quantidade vendida).

## 5) Endpoints Usados Pela Interface Atual

- `GET /produtos/`
- `GET /produtos/metricas/`
- `GET /produtos/{id_produto}`
- `GET /produtos/{id_produto}/avaliacoes/`
- `POST /produtos/`
- `PATCH /produtos/{id_produto}`
- `DELETE /produtos/{id_produto}`
- `GET /categorias-imagens/`

## 6) Rotas Frontend Ativas

- `/`
- `/produtos/:idProduto`
- `*` redireciona para `/`

Rota removida por nao uso:

- `/catalogo`

## 7) Comandos Uteis

Backend:

```bash
cd backend
source venv/bin/activate
alembic current
alembic upgrade head
```

Frontend:

```bash
cd frontend
pnpm lint
pnpm build
```

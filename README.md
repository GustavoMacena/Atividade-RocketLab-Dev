# Rocketlab 2026 - Tutorial Completo e Explicativo

Este guia foi escrito para voce conseguir rodar o projeto do zero, entender o que cada passo faz e saber como validar se esta tudo certo.

## 1) Visao Geral do Projeto

Este repositorio tem dois servicos:

- `backend`: API FastAPI + SQLAlchemy + Alembic + SQLite.
- `frontend`: app React + TypeScript + Vite.

Na pratica:

- O frontend roda em `http://localhost:5173`.
- O backend roda em `http://localhost:8000`.
- O frontend chama `/api/...`, e o Vite faz proxy para o backend.

## 2) Pre-requisitos

Voce precisa ter instalado:

- Python 3.11+
- Node.js 20+
- pnpm 9+

Opcional, mas recomendado: confira versoes antes de comecar.

```bash
python3 --version
node --version
pnpm --version
```

## 3) Setup Inicial (primeira vez)

Esta secao prepara tudo: dependencias, banco e dados.

### 3.1 Backend: ambiente e dependencias

No terminal 1 (na raiz do repositorio):

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

O que isso faz:

- `python3 -m venv venv`: cria um ambiente virtual isolado.
- `source venv/bin/activate`: ativa o ambiente virtual.
- `pip install -r requirements.txt`: instala FastAPI, SQLAlchemy, Alembic etc.

### 3.2 Backend: variaveis de ambiente

Ainda em `backend`:

```bash
cp .env.example .env
```

Valor padrao atual:

- `DATABASE_URL=sqlite:///./database.db`

Isso significa que o arquivo do SQLite sera criado/lido dentro da pasta `backend`.

### 3.3 Backend: migrations (estrutura do banco)

Ainda em `backend` com o venv ativo:

```bash
alembic upgrade head
```

O que isso faz:

- aplica todas as migrations em `alembic/versions`.
- cria/atualiza as tabelas da API no banco.

### 3.4 Backend: carga dos CSVs

Ainda em `backend`:

```bash
python scripts/populate_from_csv.py
```

O que isso faz:

- limpa as tabelas alvo.
- importa os CSVs da pasta `Banco de Dados da Atividade`.
- preenche os dados usados pelo catalogo e tela de detalhe.

Importante:

- este script e pensado para carga de ambiente local.
- ao rodar novamente, ele recarrega os dados das tabelas.

## 4) Subir os Servicos

### 4.1 Subir backend

No terminal 1, dentro de `backend` com venv ativo:

```bash
python -m app.main
```

Validacoes esperadas:

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Health: `http://localhost:8000/`

Teste rapido por terminal:

```bash
curl http://localhost:8000/
```

Resposta esperada (aprox.):

```json
{"status":"ok","message":"API rodando com sucesso!"}
```

### 4.2 Subir frontend

No terminal 2 (novo terminal, na raiz do repositorio):

```bash
cd frontend
pnpm install
pnpm dev
```

Validacao esperada:

- app disponivel em `http://localhost:5173`

## 5) Como Frontend e Backend se Conectam

O frontend usa `VITE_API_BASE_URL=/api` por padrao.

No desenvolvimento, o Vite faz proxy:

- `/api/*` -> `http://localhost:8000/*`

Por isso, os dois servicos precisam estar rodando ao mesmo tempo.

## 6) Roteiro de Validacao Funcional

Com backend e frontend de pe:

1. Abra `http://localhost:5173` e confirme que o catalogo carrega.
2. Use pesquisa/filtros e veja se a lista responde.
3. Clique em um produto para abrir `/produtos/:idProduto`.
4. Na tela de detalhe, valide metricas e avaliacoes.
5. Crie um produto no cabecalho e confirme que aparece no catalogo.
6. Atualize um produto e confira se os dados mudam na tela.
7. Remova um produto e confirme retorno para a tela inicial.

## 7) Endpoints Reais Consumidos Pelo Frontend

- `GET /produtos/`
- `GET /produtos/metricas/`
- `GET /produtos/{id_produto}`
- `GET /produtos/{id_produto}/avaliacoes/`
- `POST /produtos/`
- `PATCH /produtos/{id_produto}`
- `DELETE /produtos/{id_produto}`
- `GET /categorias-imagens/`

## 8) Rotas Frontend Ativas

- `/` (catalogo)
- `/produtos/:idProduto` (detalhe)
- `*` redireciona para `/`

Rota removida por nao uso:

- `/catalogo`

## 9) Rotina do Dia a Dia (depois do setup inicial)

Quando as dependencias ja estao instaladas, normalmente voce so precisa:

Terminal 1:

```bash
cd backend
source venv/bin/activate
python -m app.main
```

Terminal 2:

```bash
cd frontend
pnpm dev
```

## 10) Comandos Uteis

Backend:

```bash
cd backend
source venv/bin/activate
alembic current
alembic upgrade head
python scripts/populate_from_csv.py
```

Frontend:

```bash
cd frontend
pnpm lint
pnpm build
```

## 11) Troubleshooting (Problemas Comuns)

### 11.1 `alembic: command not found`

Causa comum: venv nao ativado.

Solucao:

```bash
cd backend
source venv/bin/activate
alembic current
```

### 11.2 `ModuleNotFoundError: No module named app`

Causa comum: comando rodado fora da pasta `backend`.

Solucao:

```bash
cd backend
source venv/bin/activate
python -m app.main
```

### 11.3 Front nao carrega dados

Checklist:

1. backend esta rodando em `http://localhost:8000`.
2. frontend esta rodando em `http://localhost:5173`.
3. banco foi migrado e populado (`alembic upgrade head` + `populate_from_csv.py`).

### 11.4 Porta em uso

Se alguma porta estiver ocupada, encerre o processo antigo (Ctrl+C no terminal correspondente) e suba novamente.

## 12) Reset Completo do Banco Local (opcional)

Use esta secao se quiser recriar dados locais do zero.

No terminal, na raiz do projeto:

```bash
cd backend
source venv/bin/activate
rm -f database.db
alembic upgrade head
python scripts/populate_from_csv.py
```

## 13) Documentacao Complementar

- Detalhes do backend: `backend/README.md`
- Detalhes do frontend: `frontend/README.md`

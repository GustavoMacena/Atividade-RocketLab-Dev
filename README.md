# RocketLab 2026 - Sistema de Gerenciamento de E-Commerce

Projeto full-stack para gerenciamento de catalogo, produtos, pedidos, consumidores e vendedores.

Stack do repositorio:
- Frontend: Vite + React + TypeScript + Ant Design + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + Alembic
- Banco de dados: SQLite
- Carga inicial: arquivos CSV em Banco de Dados da Atividade

---

## 1. Pre-requisitos

Instale no ambiente local:

- Git
- Python 3.11+ (recomendado 3.12)
- pip (normalmente ja vem com Python)
- Node.js 20+ (LTS recomendado)
- pnpm 9+ (recomendado, pois o projeto usa pnpm-lock.yaml)

Validacao rapida:

    git --version
    python --version
    pip --version
    node --version
    pnpm --version

Se pnpm nao estiver instalado:

    corepack enable
    corepack prepare pnpm@latest --activate

---

## 2. Estrutura principal

    rocketlab2026/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py
    │   │   ├── config.py
    │   │   ├── database.py
    │   │   ├── models/
    │   │   ├── schemas/
    │   │   └── routers/
    │   ├── alembic/
    │   │   ├── env.py
    │   │   └── versions/
    │   ├── scripts/
    │   │   └── populate_from_csv.py
    │   ├── Banco de Dados da Atividade/
    │   │   └── *.csv
    │   ├── requirements.txt
    │   ├── alembic.ini
    │   └── .env.example
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   ├── vite.config.ts
    │   └── pnpm-lock.yaml
    └── .gitignore

---

## 3. Setup do Backend (FastAPI)

Execute os comandos dentro da pasta backend.

### 3.1 Entrar na pasta

    cd backend

### 3.2 Criar ambiente virtual

Linux/macOS:

    python3 -m venv .venv
    source .venv/bin/activate

Windows PowerShell:

    python -m venv .venv
    .\.venv\Scripts\Activate.ps1

Windows CMD:

    python -m venv .venv
    .venv\Scripts\activate.bat

### 3.3 Instalar dependencias

    python -m pip install --upgrade pip
    pip install -r requirements.txt

### 3.4 Configurar variaveis de ambiente

Linux/macOS:

    cp .env.example .env

Windows PowerShell:

    Copy-Item .env.example .env

Windows CMD:

    copy .env.example .env

Valor padrao no arquivo .env:

    DATABASE_URL=sqlite:///./database.db

Observacao importante:
- O caminho do SQLite e relativo.
- Rode comandos do backend a partir da pasta backend para criar/usar backend/database.db.

### 3.5 Rodar migracoes (Alembic)

    alembic upgrade head

Conferencias uteis:

    alembic current
    alembic history --verbose

### 3.6 Popular banco com CSVs

O projeto ja possui script pronto:

    python scripts/populate_from_csv.py

Esse script:
- limpa tabelas em ordem segura,
- importa os CSVs em lote,
- insere categoria sem_categoria quando necessario,
- conclui com commit no SQLite.

### 3.7 Subir API

Opcao usada no projeto:

    python -m app.main

Opcao equivalente:

    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Acessos:
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

---

## 4. Setup do Frontend (Vite + React + TypeScript)

Use outro terminal para o frontend.

### 4.1 Entrar na pasta

    cd frontend

### 4.2 Instalar dependencias

Recomendado (pnpm):

    pnpm install

Alternativas:
- npm install
- yarn

### 4.3 Configuracao da URL da API

Comportamento atual:
- src/services/apiConfig.ts usa VITE_API_BASE_URL e fallback para /api
- vite.config.ts faz proxy de /api para http://localhost:8000

Na maioria dos casos locais, nao precisa mudar nada.

Se quiser explicitar, crie frontend/.env.local com:

    VITE_API_BASE_URL=/api

Opcao sem proxy (direto no backend):

    VITE_API_BASE_URL=http://localhost:8000

Recomendacao:
- Em desenvolvimento local, mantenha /api + proxy para evitar problemas de CORS.

### 4.4 Subir frontend

    pnpm dev

Acesso:
- http://localhost:5173

---

## 5. Execucao rapida (resumo)

Terminal 1 - backend:

    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env
    alembic upgrade head
    python scripts/populate_from_csv.py
    python -m app.main

Terminal 2 - frontend:

    cd frontend
    pnpm install
    pnpm dev

---

## 6. Como testar a aplicacao

Fluxo sugerido:

1. Abrir http://localhost:5173.
2. Confirmar carregamento do catalogo.
3. Usar busca por nome ou ID de produto.
4. Abrir filtros e testar categoria, media minima e quantidade vendida minima.
5. Clicar em um card para abrir detalhe do produto.
6. Validar dados de detalhe (categoria, tamanho, peso, metricas).
7. Acessar http://localhost:8000/docs e testar endpoints principais:
   - GET /produtos/
   - GET /produtos/metricas/
   - GET /categorias-imagens/

---

## 7. Problemas comuns e solucoes

### 7.1 Comando alembic nao encontrado
Causa:
- ambiente virtual nao ativado.

Solucao:

    source .venv/bin/activate
    alembic upgrade head

Ou:

    python -m alembic upgrade head

### 7.2 Erro ModuleNotFoundError: No module named app
Causa:
- comando executado fora da pasta backend.

Solucao:

    cd backend
    python -m app.main

### 7.3 Erro no such table
Causa:
- migracoes nao executadas.

Solucao:

    alembic upgrade head
    python scripts/populate_from_csv.py

### 7.4 Porta 8000 ocupada
Solucao:

    uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

Se mudar porta, ajuste proxy no vite.config.ts ou VITE_API_BASE_URL.

### 7.5 Porta 5173 ocupada
Solucao:

    pnpm dev --port 5174

### 7.6 pnpm nao encontrado
Solucao:

    corepack enable
    corepack prepare pnpm@latest --activate

### 7.7 Falha de fetch no frontend
Checklist:
- backend em execucao na porta correta,
- frontend em execucao,
- proxy /api ativo no Vite,
- endpoint chamado com formato correto (incluindo barra final quando aplicavel).

---

## 8. Contribuicao

Fluxo sugerido:

1. Fazer fork do repositorio.
2. Criar branch de feature ou fix.
3. Realizar commits pequenos e descritivos.
4. Abrir Pull Request com contexto, motivacao e passos de teste.

---

## 9. Licenca

Nao ha arquivo de licenca definido na raiz do repositorio no estado atual.
Se o projeto for distribuido publicamente, recomenda-se adicionar um arquivo LICENSE.

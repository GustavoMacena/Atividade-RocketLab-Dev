# Frontend - Catalogo de Produtos

Aplicacao web em React + TypeScript + Vite para listar, filtrar e gerenciar produtos.

## Requisitos

- Node.js 20+
- pnpm 9+

## Passo a Passo

1. Entre na pasta do frontend:

```bash
cd frontend
```

2. Instale as dependencias:

```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

4. Acesse no navegador:

http://localhost:5173

## Integracao com Backend

Por padrao, o frontend usa `VITE_API_BASE_URL=/api` e o Vite faz proxy para `http://localhost:8000`.

Configuracao atual do proxy (`vite.config.ts`):

- `/api/*` -> `http://localhost:8000/*`

Isso significa que os dois servicos devem estar rodando ao mesmo tempo:

- Backend em `http://localhost:8000`
- Frontend em `http://localhost:5173`

## Rotas do Frontend (Ativas)

- `/` (catalogo)
- `/produtos/:idProduto` (detalhe do produto)
- `*` redireciona para `/`

Rota removida por nao uso:

- `/catalogo`

## Endpoints da API Consumidos no Front

### Catalogo

- `GET /produtos/`
- `GET /produtos/metricas/`
- `GET /categorias-imagens/`

### Detalhe do Produto

- `GET /produtos/{id_produto}`
- `GET /produtos/{id_produto}/avaliacoes/`

### Acoes de Produto

- `POST /produtos/`
- `PATCH /produtos/{id_produto}`
- `DELETE /produtos/{id_produto}`

## Scripts

- `pnpm dev`: sobe ambiente de desenvolvimento
- `pnpm build`: gera build de producao
- `pnpm preview`: serve build localmente
- `pnpm lint`: roda o ESLint

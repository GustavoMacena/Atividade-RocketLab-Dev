# Backend - Sistema de Compras Online

API REST com FastAPI + SQLAlchemy + Alembic usando SQLite.

## Requisitos

- Python 3.11+
- `pip`

## Passo a Passo Completo

1. Entre na pasta do backend:

```bash
cd backend
```

2. Crie o ambiente virtual (se ainda nao existir):

```bash
python3 -m venv venv
```

3. Ative o ambiente virtual:

```bash
source venv/bin/activate
```

4. Instale as dependencias:

```bash
pip install -r requirements.txt
```

5. Configure o arquivo de ambiente:

```bash
cp .env.example .env
```

6. Execute as migrations do banco:

```bash
alembic upgrade head
```

7. Popule o banco com os CSVs da atividade:

```bash
python scripts/populate_from_csv.py
```

8. Suba a API:

```bash
python -m app.main
```

API local: http://localhost:8000

Swagger: http://localhost:8000/docs

## Comandos Uteis

Ver revision atual do Alembic:

```bash
alembic current
```

Gerar nova migration:

```bash
alembic revision -m "descricao_da_mudanca"
```

Aplicar ultima migration:

```bash
alembic upgrade head
```

Voltar uma migration:

```bash
alembic downgrade -1
```

## Rotas da API

### Health

- `GET /`

### Produtos

- `POST /produtos/`
- `GET /produtos/`
- `GET /produtos/metricas/`
- `GET /produtos/{id_produto}/avaliacoes/`
- `GET /produtos/{id_produto}`
- `PUT /produtos/{id_produto}`
- `PATCH /produtos/{id_produto}`
- `DELETE /produtos/{id_produto}`

### Categorias de Imagens

- `POST /categorias-imagens/`
- `GET /categorias-imagens/`
- `GET /categorias-imagens/{categoria}`
- `PUT /categorias-imagens/{categoria}`
- `PATCH /categorias-imagens/{categoria}`
- `DELETE /categorias-imagens/{categoria}`

### Consumidores

- `POST /consumidores/`
- `GET /consumidores/`
- `GET /consumidores/{id_consumidor}`
- `PUT /consumidores/{id_consumidor}`
- `PATCH /consumidores/{id_consumidor}`
- `DELETE /consumidores/{id_consumidor}`

### Vendedores

- `POST /vendedores/`
- `GET /vendedores/`
- `GET /vendedores/{id_vendedor}`
- `PUT /vendedores/{id_vendedor}`
- `PATCH /vendedores/{id_vendedor}`
- `DELETE /vendedores/{id_vendedor}`

### Pedidos

- `POST /pedidos/`
- `GET /pedidos/`
- `GET /pedidos/{id_pedido}`
- `PUT /pedidos/{id_pedido}`
- `PATCH /pedidos/{id_pedido}`
- `DELETE /pedidos/{id_pedido}`

### Itens de Pedidos

- `POST /itens-pedidos/`
- `GET /itens-pedidos/`
- `GET /itens-pedidos/{id_pedido}/{id_item}`
- `PUT /itens-pedidos/{id_pedido}/{id_item}`
- `PATCH /itens-pedidos/{id_pedido}/{id_item}`
- `DELETE /itens-pedidos/{id_pedido}/{id_item}`

### Avaliacoes de Pedidos

- `POST /avaliacoes-pedidos/`
- `GET /avaliacoes-pedidos/`
- `GET /avaliacoes-pedidos/{id_avaliacao}`
- `PUT /avaliacoes-pedidos/{id_avaliacao}`
- `PATCH /avaliacoes-pedidos/{id_avaliacao}`
- `DELETE /avaliacoes-pedidos/{id_avaliacao}`

## Endpoints Consumidos Pelo Frontend

Atualmente o frontend consome somente os endpoints abaixo:

- `GET /produtos/`
- `GET /produtos/metricas/`
- `GET /produtos/{id_produto}`
- `POST /produtos/`
- `PATCH /produtos/{id_produto}`
- `DELETE /produtos/{id_produto}`
- `GET /produtos/{id_produto}/avaliacoes/`
- `GET /categorias-imagens/`

Observacao: as rotas restantes continuam disponiveis no backend, mas nao sao chamadas pela interface web atual.

from fastapi import FastAPI

from app.routers import (
    avaliacoes_pedidos,
    categorias_imagens,
    consumidores,
    itens_pedidos,
    pedidos,
    produtos,
    vendedores,
)

app = FastAPI(
    title="Sistema de Compras Online",
    description="API para gerenciamento de pedidos, produtos, consumidores e vendedores.",
    version="1.0.0",
)

app.include_router(consumidores.router)
app.include_router(produtos.router)
app.include_router(vendedores.router)
app.include_router(pedidos.router)
app.include_router(itens_pedidos.router)
app.include_router(avaliacoes_pedidos.router)
app.include_router(categorias_imagens.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

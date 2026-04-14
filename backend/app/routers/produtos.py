from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.item_pedido import ItemPedido
from app.models.produto import Produto
from app.schemas.produto import (
    ProdutoBase,
    ProdutoCreate,
    ProdutoMetricaRead,
    ProdutoRead,
    ProdutoUpdate,
)

router = APIRouter(prefix="/produtos", tags=["Produtos"])


# HELPER: busca produto por id ou retorna erro 404.
def _get_produto_or_404(db: Session, id_produto: str) -> Produto:
    produto = db.get(Produto, id_produto)
    if produto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto nao encontrado.")
    return produto


# ROTA: cria um novo produto.
@router.post("/", response_model=ProdutoRead, status_code=status.HTTP_201_CREATED)
def create_produto(payload: ProdutoCreate, db: Session = Depends(get_db)) -> Produto:
    existing = db.get(Produto, payload.id_produto)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Produto ja existe.")

    produto = Produto(**payload.model_dump())
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto


# ROTA: lista produtos com paginacao.
@router.get("/", response_model=list[ProdutoRead])
def list_produtos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[Produto]:
    stmt = select(Produto).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: lista metricas agregadas por produto.
@router.get("/metricas/", response_model=list[ProdutoMetricaRead])
def list_metricas_produtos(
    ids_produtos: list[str] | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[ProdutoMetricaRead]:
    vendidos_subquery = (
        select(
            ItemPedido.id_produto.label("id_produto"),
            func.count().label("quantidade_vendida"),
        )
        .group_by(ItemPedido.id_produto)
        .subquery()
    )

    media_subquery = (
        select(
            ItemPedido.id_produto.label("id_produto"),
            func.avg(AvaliacaoPedido.avaliacao).label("media_avaliacao"),
        )
        .join(AvaliacaoPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido)
        .group_by(ItemPedido.id_produto)
        .subquery()
    )

    stmt = (
        select(
            Produto.id_produto.label("id_produto"),
            func.coalesce(vendidos_subquery.c.quantidade_vendida, 0).label("quantidade_vendida"),
            media_subquery.c.media_avaliacao.label("media_avaliacao"),
        )
        .outerjoin(vendidos_subquery, vendidos_subquery.c.id_produto == Produto.id_produto)
        .outerjoin(media_subquery, media_subquery.c.id_produto == Produto.id_produto)
        .order_by(Produto.id_produto)
    )

    if ids_produtos:
        stmt = stmt.where(Produto.id_produto.in_(ids_produtos))

    rows = db.execute(stmt).all()
    return [
        ProdutoMetricaRead(
            id_produto=row.id_produto,
            quantidade_vendida=int(row.quantidade_vendida),
            media_avaliacao=(
                float(row.media_avaliacao)
                if row.media_avaliacao is not None
                else None
            ),
        )
        for row in rows
    ]


# ROTA: retorna um produto por id.
@router.get("/{id_produto}", response_model=ProdutoRead)
def get_produto(id_produto: str, db: Session = Depends(get_db)) -> Produto:
    return _get_produto_or_404(db, id_produto)


# ROTA: substitui todos os campos de um produto.
@router.put("/{id_produto}", response_model=ProdutoRead)
def replace_produto(
    id_produto: str,
    payload: ProdutoBase,
    db: Session = Depends(get_db),
) -> Produto:
    produto = _get_produto_or_404(db, id_produto)

    for field, value in payload.model_dump().items():
        setattr(produto, field, value)

    db.commit()
    db.refresh(produto)
    return produto


# ROTA: atualiza parcialmente um produto.
@router.patch("/{id_produto}", response_model=ProdutoRead)
def update_produto(
    id_produto: str,
    payload: ProdutoUpdate,
    db: Session = Depends(get_db),
) -> Produto:
    produto = _get_produto_or_404(db, id_produto)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return produto

    for field, value in update_data.items():
        setattr(produto, field, value)

    db.commit()
    db.refresh(produto)
    return produto


# ROTA: remove um produto por id.
@router.delete("/{id_produto}", status_code=status.HTTP_204_NO_CONTENT)
def delete_produto(id_produto: str, db: Session = Depends(get_db)) -> Response:
    produto = _get_produto_or_404(db, id_produto)

    db.delete(produto)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

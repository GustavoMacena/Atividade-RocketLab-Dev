from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.consumidor import Consumidor
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.schemas.produto import (
    ProdutoAvaliacaoRead,
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
    stmt = select(Produto).order_by(Produto.id_produto).offset(skip).limit(limit)
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


# ROTA: lista avaliacoes de um produto com nome do consumidor.
@router.get("/{id_produto}/avaliacoes/", response_model=list[ProdutoAvaliacaoRead])
def list_avaliacoes_produto(id_produto: str, db: Session = Depends(get_db)) -> list[ProdutoAvaliacaoRead]:
    _get_produto_or_404(db, id_produto)

    item_produto_por_pedido_subquery = (
        select(
            ItemPedido.id_pedido.label("id_pedido"),
            func.min(ItemPedido.id_item).label("id_item"),
        )
        .where(ItemPedido.id_produto == id_produto)
        .group_by(ItemPedido.id_pedido)
        .subquery()
    )

    stmt = (
        select(
            AvaliacaoPedido.id_avaliacao.label("id_avaliacao"),
            AvaliacaoPedido.id_pedido.label("id_pedido"),
            Consumidor.nome_consumidor.label("nome_consumidor"),
            Pedido.id_consumidor.label("id_consumidor"),
            ItemPedido.id_vendedor.label("id_vendedor"),
            Vendedor.nome_vendedor.label("nome_vendedor"),
            AvaliacaoPedido.comentario.label("comentario"),
            AvaliacaoPedido.titulo_comentario.label("titulo_comentario"),
            AvaliacaoPedido.avaliacao.label("nota"),
        )
        .join(
            item_produto_por_pedido_subquery,
            item_produto_por_pedido_subquery.c.id_pedido == AvaliacaoPedido.id_pedido,
        )
        .join(
            ItemPedido,
            (
                ItemPedido.id_pedido == item_produto_por_pedido_subquery.c.id_pedido
            )
            & (
                ItemPedido.id_item == item_produto_por_pedido_subquery.c.id_item
            ),
        )
        .join(Pedido, Pedido.id_pedido == AvaliacaoPedido.id_pedido)
        .join(Consumidor, Consumidor.id_consumidor == Pedido.id_consumidor)
        .join(Vendedor, Vendedor.id_vendedor == ItemPedido.id_vendedor)
        .order_by(AvaliacaoPedido.data_comentario.desc(), AvaliacaoPedido.id_avaliacao)
    )

    rows = db.execute(stmt).all()

    return [
        ProdutoAvaliacaoRead(
            id_avaliacao=row.id_avaliacao,
            id_pedido=row.id_pedido,
            nome_consumidor=row.nome_consumidor,
            id_consumidor=row.id_consumidor,
            id_vendedor=row.id_vendedor,
            nome_vendedor=row.nome_vendedor,
            descricao_avaliacao=(
                (row.comentario.strip() if row.comentario else "")
                or (row.titulo_comentario.strip() if row.titulo_comentario else "")
                or "Avaliacao sem descricao."
            ),
            nota=int(row.nota),
            tem_comentario=bool(row.comentario and row.comentario.strip()),
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

    try:
        # Remove dependencias diretas antes de excluir o produto para evitar violacao de FK.
        db.execute(delete(ItemPedido).where(ItemPedido.id_produto == id_produto))
        db.delete(produto)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Nao foi possivel remover o produto por causa de relacionamentos existentes.",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)

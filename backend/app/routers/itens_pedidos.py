from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.schemas.item_pedido import ItemPedidoBase, ItemPedidoCreate, ItemPedidoRead, ItemPedidoUpdate

router = APIRouter(prefix="/itens-pedidos", tags=["ItensPedidos"])


# HELPER: busca item por chave composta ou retorna erro 404.
def _get_item_pedido_or_404(db: Session, id_pedido: str, id_item: int) -> ItemPedido:
    stmt = select(ItemPedido).where(
        ItemPedido.id_pedido == id_pedido,
        ItemPedido.id_item == id_item,
    )
    item_pedido = db.execute(stmt).scalar_one_or_none()
    if item_pedido is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ItemPedido nao encontrado.")
    return item_pedido


# HELPER: valida se entidades relacionadas existem antes do write.
def _ensure_relacoes_existem(
    db: Session,
    *,
    id_pedido: str | None = None,
    id_produto: str | None = None,
    id_vendedor: str | None = None,
) -> None:
    if id_pedido is not None and db.get(Pedido, id_pedido) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido informado nao existe.")

    if id_produto is not None and db.get(Produto, id_produto) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto informado nao existe.")

    if id_vendedor is not None and db.get(Vendedor, id_vendedor) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendedor informado nao existe.")


# ROTA: cria um item de pedido.
@router.post("/", response_model=ItemPedidoRead, status_code=status.HTTP_201_CREATED)
def create_item_pedido(payload: ItemPedidoCreate, db: Session = Depends(get_db)) -> ItemPedido:
    existing = db.get(
        ItemPedido,
        {
            "id_pedido": payload.id_pedido,
            "id_item": payload.id_item,
        },
    )
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="ItemPedido ja existe.")

    _ensure_relacoes_existem(
        db,
        id_pedido=payload.id_pedido,
        id_produto=payload.id_produto,
        id_vendedor=payload.id_vendedor,
    )

    item_pedido = ItemPedido(**payload.model_dump())
    db.add(item_pedido)
    db.commit()
    db.refresh(item_pedido)
    return item_pedido


# ROTA: lista itens de pedido com paginacao.
@router.get("/", response_model=list[ItemPedidoRead])
def list_itens_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[ItemPedido]:
    stmt = select(ItemPedido).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: retorna item por chave composta id_pedido e id_item.
@router.get("/{id_pedido}/{id_item}", response_model=ItemPedidoRead)
def get_item_pedido(id_pedido: str, id_item: int, db: Session = Depends(get_db)) -> ItemPedido:
    return _get_item_pedido_or_404(db, id_pedido, id_item)


# ROTA: substitui todos os campos de um item de pedido.
@router.put("/{id_pedido}/{id_item}", response_model=ItemPedidoRead)
def replace_item_pedido(
    id_pedido: str,
    id_item: int,
    payload: ItemPedidoBase,
    db: Session = Depends(get_db),
) -> ItemPedido:
    item_pedido = _get_item_pedido_or_404(db, id_pedido, id_item)
    _ensure_relacoes_existem(
        db,
        id_produto=payload.id_produto,
        id_vendedor=payload.id_vendedor,
    )

    for field, value in payload.model_dump().items():
        setattr(item_pedido, field, value)

    db.commit()
    db.refresh(item_pedido)
    return item_pedido


# ROTA: atualiza parcialmente um item de pedido.
@router.patch("/{id_pedido}/{id_item}", response_model=ItemPedidoRead)
def update_item_pedido(
    id_pedido: str,
    id_item: int,
    payload: ItemPedidoUpdate,
    db: Session = Depends(get_db),
) -> ItemPedido:
    item_pedido = _get_item_pedido_or_404(db, id_pedido, id_item)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return item_pedido

    if "id_produto" in update_data and update_data["id_produto"] is not None:
        _ensure_relacoes_existem(db, id_produto=update_data["id_produto"])

    if "id_vendedor" in update_data and update_data["id_vendedor"] is not None:
        _ensure_relacoes_existem(db, id_vendedor=update_data["id_vendedor"])

    for field, value in update_data.items():
        setattr(item_pedido, field, value)

    db.commit()
    db.refresh(item_pedido)
    return item_pedido


# ROTA: remove um item por chave composta.
@router.delete("/{id_pedido}/{id_item}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_pedido(id_pedido: str, id_item: int, db: Session = Depends(get_db)) -> Response:
    item_pedido = _get_item_pedido_or_404(db, id_pedido, id_item)

    db.delete(item_pedido)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

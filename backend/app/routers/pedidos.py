from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.consumidor import Consumidor
from app.models.pedido import Pedido
from app.schemas.pedido import PedidoBase, PedidoCreate, PedidoRead, PedidoUpdate

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


# HELPER: busca pedido por id ou retorna erro 404.
def _get_pedido_or_404(db: Session, id_pedido: str) -> Pedido:
    pedido = db.get(Pedido, id_pedido)
    if pedido is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido nao encontrado.")
    return pedido


# HELPER: valida se o consumidor informado existe.
def _ensure_consumidor_exists(db: Session, id_consumidor: str) -> None:
    consumidor = db.get(Consumidor, id_consumidor)
    if consumidor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consumidor informado nao existe.",
        )


# ROTA: cria um novo pedido.
@router.post("/", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def create_pedido(payload: PedidoCreate, db: Session = Depends(get_db)) -> Pedido:
    existing = db.get(Pedido, payload.id_pedido)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Pedido ja existe.")

    _ensure_consumidor_exists(db, payload.id_consumidor)

    pedido = Pedido(**payload.model_dump())
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido


# ROTA: lista pedidos com paginacao.
@router.get("/", response_model=list[PedidoRead])
def list_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[Pedido]:
    stmt = select(Pedido).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: retorna um pedido por id.
@router.get("/{id_pedido}", response_model=PedidoRead)
def get_pedido(id_pedido: str, db: Session = Depends(get_db)) -> Pedido:
    return _get_pedido_or_404(db, id_pedido)


# ROTA: substitui todos os campos de um pedido.
@router.put("/{id_pedido}", response_model=PedidoRead)
def replace_pedido(
    id_pedido: str,
    payload: PedidoBase,
    db: Session = Depends(get_db),
) -> Pedido:
    pedido = _get_pedido_or_404(db, id_pedido)
    _ensure_consumidor_exists(db, payload.id_consumidor)

    for field, value in payload.model_dump().items():
        setattr(pedido, field, value)

    db.commit()
    db.refresh(pedido)
    return pedido


# ROTA: atualiza parcialmente um pedido.
@router.patch("/{id_pedido}", response_model=PedidoRead)
def update_pedido(
    id_pedido: str,
    payload: PedidoUpdate,
    db: Session = Depends(get_db),
) -> Pedido:
    pedido = _get_pedido_or_404(db, id_pedido)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return pedido

    if "id_consumidor" in update_data:
        _ensure_consumidor_exists(db, update_data["id_consumidor"])

    for field, value in update_data.items():
        setattr(pedido, field, value)

    db.commit()
    db.refresh(pedido)
    return pedido


# ROTA: remove um pedido por id.
@router.delete("/{id_pedido}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pedido(id_pedido: str, db: Session = Depends(get_db)) -> Response:
    pedido = _get_pedido_or_404(db, id_pedido)

    db.delete(pedido)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.pedido import Pedido
from app.schemas.avaliacao_pedido import (
    AvaliacaoPedidoBase,
    AvaliacaoPedidoCreate,
    AvaliacaoPedidoRead,
    AvaliacaoPedidoUpdate,
)

router = APIRouter(prefix="/avaliacoes-pedidos", tags=["AvaliacoesPedidos"])


# HELPER: busca avaliacao por id ou retorna erro 404.
def _get_avaliacao_or_404(db: Session, id_avaliacao: str) -> AvaliacaoPedido:
    avaliacao = db.get(AvaliacaoPedido, id_avaliacao)
    if avaliacao is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AvaliacaoPedido nao encontrada.")
    return avaliacao


# HELPER: valida se o pedido informado existe.
def _ensure_pedido_exists(db: Session, id_pedido: str) -> None:
    pedido = db.get(Pedido, id_pedido)
    if pedido is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido informado nao existe.")


# ROTA: cria uma nova avaliacao de pedido.
@router.post("/", response_model=AvaliacaoPedidoRead, status_code=status.HTTP_201_CREATED)
def create_avaliacao_pedido(
    payload: AvaliacaoPedidoCreate,
    db: Session = Depends(get_db),
) -> AvaliacaoPedido:
    existing = db.get(AvaliacaoPedido, payload.id_avaliacao)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="AvaliacaoPedido ja existe.")

    _ensure_pedido_exists(db, payload.id_pedido)

    avaliacao = AvaliacaoPedido(**payload.model_dump())
    db.add(avaliacao)
    db.commit()
    db.refresh(avaliacao)
    return avaliacao


# ROTA: lista avaliacoes com paginacao.
@router.get("/", response_model=list[AvaliacaoPedidoRead])
def list_avaliacoes_pedidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[AvaliacaoPedido]:
    stmt = select(AvaliacaoPedido).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: retorna uma avaliacao por id.
@router.get("/{id_avaliacao}", response_model=AvaliacaoPedidoRead)
def get_avaliacao_pedido(id_avaliacao: str, db: Session = Depends(get_db)) -> AvaliacaoPedido:
    return _get_avaliacao_or_404(db, id_avaliacao)


# ROTA: substitui todos os campos de uma avaliacao.
@router.put("/{id_avaliacao}", response_model=AvaliacaoPedidoRead)
def replace_avaliacao_pedido(
    id_avaliacao: str,
    payload: AvaliacaoPedidoBase,
    db: Session = Depends(get_db),
) -> AvaliacaoPedido:
    avaliacao = _get_avaliacao_or_404(db, id_avaliacao)
    _ensure_pedido_exists(db, payload.id_pedido)

    for field, value in payload.model_dump().items():
        setattr(avaliacao, field, value)

    db.commit()
    db.refresh(avaliacao)
    return avaliacao


# ROTA: atualiza parcialmente uma avaliacao.
@router.patch("/{id_avaliacao}", response_model=AvaliacaoPedidoRead)
def update_avaliacao_pedido(
    id_avaliacao: str,
    payload: AvaliacaoPedidoUpdate,
    db: Session = Depends(get_db),
) -> AvaliacaoPedido:
    avaliacao = _get_avaliacao_or_404(db, id_avaliacao)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return avaliacao

    for field, value in update_data.items():
        setattr(avaliacao, field, value)

    db.commit()
    db.refresh(avaliacao)
    return avaliacao


# ROTA: remove uma avaliacao por id.
@router.delete("/{id_avaliacao}", status_code=status.HTTP_204_NO_CONTENT)
def delete_avaliacao_pedido(id_avaliacao: str, db: Session = Depends(get_db)) -> Response:
    avaliacao = _get_avaliacao_or_404(db, id_avaliacao)

    db.delete(avaliacao)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

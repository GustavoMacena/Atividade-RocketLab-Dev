from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.consumidor import Consumidor
from app.schemas.consumidor import (
    ConsumidorBase,
    ConsumidorCreate,
    ConsumidorRead,
    ConsumidorUpdate,
)

router = APIRouter(prefix="/consumidores", tags=["Consumidores"])


# HELPER: busca consumidor por id ou retorna erro 404.
def _get_consumidor_or_404(db: Session, id_consumidor: str) -> Consumidor:
    consumidor = db.get(Consumidor, id_consumidor)
    if consumidor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consumidor nao encontrado.")
    return consumidor


# ROTA: cria um novo consumidor.
@router.post("/", response_model=ConsumidorRead, status_code=status.HTTP_201_CREATED)
def create_consumidor(payload: ConsumidorCreate, db: Session = Depends(get_db)) -> Consumidor:
    existing = db.get(Consumidor, payload.id_consumidor)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Consumidor ja existe.")

    consumidor = Consumidor(**payload.model_dump())
    db.add(consumidor)
    db.commit()
    db.refresh(consumidor)
    return consumidor


# ROTA: lista consumidores com paginacao.
@router.get("/", response_model=list[ConsumidorRead])
def list_consumidores(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[Consumidor]:
    stmt = select(Consumidor).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: retorna um consumidor por id.
@router.get("/{id_consumidor}", response_model=ConsumidorRead)
def get_consumidor(id_consumidor: str, db: Session = Depends(get_db)) -> Consumidor:
    return _get_consumidor_or_404(db, id_consumidor)


# ROTA: substitui todos os campos de um consumidor.
@router.put("/{id_consumidor}", response_model=ConsumidorRead)
def replace_consumidor(
    id_consumidor: str,
    payload: ConsumidorBase,
    db: Session = Depends(get_db),
) -> Consumidor:
    consumidor = _get_consumidor_or_404(db, id_consumidor)

    for field, value in payload.model_dump().items():
        setattr(consumidor, field, value)

    db.commit()
    db.refresh(consumidor)
    return consumidor


# ROTA: atualiza parcialmente um consumidor.
@router.patch("/{id_consumidor}", response_model=ConsumidorRead)
def update_consumidor(
    id_consumidor: str,
    payload: ConsumidorUpdate,
    db: Session = Depends(get_db),
) -> Consumidor:
    consumidor = _get_consumidor_or_404(db, id_consumidor)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return consumidor

    for field, value in update_data.items():
        setattr(consumidor, field, value)

    db.commit()
    db.refresh(consumidor)
    return consumidor


# ROTA: remove um consumidor por id.
@router.delete("/{id_consumidor}", status_code=status.HTTP_204_NO_CONTENT)
def delete_consumidor(id_consumidor: str, db: Session = Depends(get_db)) -> Response:
    consumidor = _get_consumidor_or_404(db, id_consumidor)

    db.delete(consumidor)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

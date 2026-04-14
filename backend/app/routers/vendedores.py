from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vendedor import Vendedor
from app.schemas.vendedor import VendedorBase, VendedorCreate, VendedorRead, VendedorUpdate

router = APIRouter(prefix="/vendedores", tags=["Vendedores"])


# HELPER: busca vendedor por id ou retorna erro 404.
def _get_vendedor_or_404(db: Session, id_vendedor: str) -> Vendedor:
    vendedor = db.get(Vendedor, id_vendedor)
    if vendedor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendedor nao encontrado.")
    return vendedor


# ROTA: cria um novo vendedor.
@router.post("/", response_model=VendedorRead, status_code=status.HTTP_201_CREATED)
def create_vendedor(payload: VendedorCreate, db: Session = Depends(get_db)) -> Vendedor:
    existing = db.get(Vendedor, payload.id_vendedor)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Vendedor ja existe.")

    vendedor = Vendedor(**payload.model_dump())
    db.add(vendedor)
    db.commit()
    db.refresh(vendedor)
    return vendedor


# ROTA: lista vendedores com paginacao.
@router.get("/", response_model=list[VendedorRead])
def list_vendedores(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[Vendedor]:
    stmt = select(Vendedor).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: retorna um vendedor por id.
@router.get("/{id_vendedor}", response_model=VendedorRead)
def get_vendedor(id_vendedor: str, db: Session = Depends(get_db)) -> Vendedor:
    return _get_vendedor_or_404(db, id_vendedor)


# ROTA: substitui todos os campos de um vendedor.
@router.put("/{id_vendedor}", response_model=VendedorRead)
def replace_vendedor(
    id_vendedor: str,
    payload: VendedorBase,
    db: Session = Depends(get_db),
) -> Vendedor:
    vendedor = _get_vendedor_or_404(db, id_vendedor)

    for field, value in payload.model_dump().items():
        setattr(vendedor, field, value)

    db.commit()
    db.refresh(vendedor)
    return vendedor


# ROTA: atualiza parcialmente um vendedor.
@router.patch("/{id_vendedor}", response_model=VendedorRead)
def update_vendedor(
    id_vendedor: str,
    payload: VendedorUpdate,
    db: Session = Depends(get_db),
) -> Vendedor:
    vendedor = _get_vendedor_or_404(db, id_vendedor)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return vendedor

    for field, value in update_data.items():
        setattr(vendedor, field, value)

    db.commit()
    db.refresh(vendedor)
    return vendedor


# ROTA: remove um vendedor por id.
@router.delete("/{id_vendedor}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vendedor(id_vendedor: str, db: Session = Depends(get_db)) -> Response:
    vendedor = _get_vendedor_or_404(db, id_vendedor)

    db.delete(vendedor)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.categoria_imagem import CategoriaImagem
from app.schemas.categoria_imagem import (
    CategoriaImagemBase,
    CategoriaImagemCreate,
    CategoriaImagemRead,
    CategoriaImagemUpdate,
)

router = APIRouter(prefix="/categorias-imagens", tags=["CategoriasImagens"])


# HELPER: busca categoria por chave primaria ou retorna 404.
def _get_categoria_or_404(db: Session, categoria: str) -> CategoriaImagem:
    categoria_imagem = db.get(CategoriaImagem, categoria)
    if categoria_imagem is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CategoriaImagem nao encontrada.",
        )
    return categoria_imagem


# ROTA: cria uma nova categoria com imagem.
@router.post("/", response_model=CategoriaImagemRead, status_code=status.HTTP_201_CREATED)
def create_categoria_imagem(
    payload: CategoriaImagemCreate,
    db: Session = Depends(get_db),
) -> CategoriaImagem:
    existing = db.get(CategoriaImagem, payload.categoria)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="CategoriaImagem ja existe.")

    categoria_imagem = CategoriaImagem(**payload.model_dump())
    db.add(categoria_imagem)
    db.commit()
    db.refresh(categoria_imagem)
    return categoria_imagem


# ROTA: lista categorias com paginacao.
@router.get("/", response_model=list[CategoriaImagemRead])
def list_categorias_imagens(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[CategoriaImagem]:
    stmt = select(CategoriaImagem).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


# ROTA: retorna uma categoria por nome.
@router.get("/{categoria}", response_model=CategoriaImagemRead)
def get_categoria_imagem(categoria: str, db: Session = Depends(get_db)) -> CategoriaImagem:
    return _get_categoria_or_404(db, categoria)


# ROTA: substitui o link da categoria.
@router.put("/{categoria}", response_model=CategoriaImagemRead)
def replace_categoria_imagem(
    categoria: str,
    payload: CategoriaImagemBase,
    db: Session = Depends(get_db),
) -> CategoriaImagem:
    categoria_imagem = _get_categoria_or_404(db, categoria)

    for field, value in payload.model_dump().items():
        setattr(categoria_imagem, field, value)

    db.commit()
    db.refresh(categoria_imagem)
    return categoria_imagem


# ROTA: atualiza parcialmente o link da categoria.
@router.patch("/{categoria}", response_model=CategoriaImagemRead)
def update_categoria_imagem(
    categoria: str,
    payload: CategoriaImagemUpdate,
    db: Session = Depends(get_db),
) -> CategoriaImagem:
    categoria_imagem = _get_categoria_or_404(db, categoria)
    update_data = payload.model_dump(exclude_unset=True)

    if not update_data:
        return categoria_imagem

    for field, value in update_data.items():
        setattr(categoria_imagem, field, value)

    db.commit()
    db.refresh(categoria_imagem)
    return categoria_imagem


# ROTA: remove uma categoria por nome.
@router.delete("/{categoria}", status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria_imagem(categoria: str, db: Session = Depends(get_db)) -> Response:
    categoria_imagem = _get_categoria_or_404(db, categoria)

    db.delete(categoria_imagem)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class CategoriaImagemBase(BaseModel):
    link: str = Field(min_length=1, max_length=2048)


# SCHEMA: payload para criacao de categoria com imagem.
class CategoriaImagemCreate(CategoriaImagemBase):
    categoria: str = Field(min_length=1, max_length=100)


# SCHEMA: payload para atualizacao parcial.
class CategoriaImagemUpdate(BaseModel):
    link: str | None = Field(default=None, min_length=1, max_length=2048)


# SCHEMA: resposta retornada pela API.
class CategoriaImagemRead(CategoriaImagemCreate):
    model_config = ConfigDict(from_attributes=True)

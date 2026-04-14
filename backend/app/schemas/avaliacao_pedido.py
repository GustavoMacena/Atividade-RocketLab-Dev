from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class AvaliacaoPedidoBase(BaseModel):
    id_pedido: str = Field(min_length=1, max_length=32)
    avaliacao: int = Field(ge=1, le=5)
    titulo_comentario: str | None = Field(default=None, max_length=255)
    comentario: str | None = Field(default=None, max_length=1000)
    data_comentario: datetime | None = None
    data_resposta: datetime | None = None


# SCHEMA: payload para criacao de avaliacao de pedido.
class AvaliacaoPedidoCreate(AvaliacaoPedidoBase):
    id_avaliacao: str = Field(min_length=1, max_length=32)


# SCHEMA: payload para atualizacao parcial de avaliacao de pedido.
class AvaliacaoPedidoUpdate(BaseModel):
    avaliacao: int | None = Field(default=None, ge=1, le=5)
    titulo_comentario: str | None = Field(default=None, max_length=255)
    comentario: str | None = Field(default=None, max_length=1000)
    data_comentario: datetime | None = None
    data_resposta: datetime | None = None


# SCHEMA: resposta de avaliacao retornada pela API.
class AvaliacaoPedidoRead(AvaliacaoPedidoCreate):
    model_config = ConfigDict(from_attributes=True)

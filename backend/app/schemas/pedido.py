from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class PedidoBase(BaseModel):
    id_consumidor: str = Field(min_length=1, max_length=32)
    status: str = Field(min_length=1, max_length=50)
    pedido_compra_timestamp: datetime | None = None
    pedido_entregue_timestamp: datetime | None = None
    data_estimada_entrega: date | None = None
    tempo_entrega_dias: float | None = Field(default=None, ge=0)
    tempo_entrega_estimado_dias: float | None = Field(default=None, ge=0)
    diferenca_entrega_dias: float | None = None
    entrega_no_prazo: str | None = Field(default=None, max_length=10)


# SCHEMA: payload para criacao de pedido.
class PedidoCreate(PedidoBase):
    id_pedido: str = Field(min_length=1, max_length=32)


# SCHEMA: payload para atualizacao parcial de pedido.
class PedidoUpdate(BaseModel):
    id_consumidor: str | None = Field(default=None, min_length=1, max_length=32)
    status: str | None = Field(default=None, min_length=1, max_length=50)
    pedido_compra_timestamp: datetime | None = None
    pedido_entregue_timestamp: datetime | None = None
    data_estimada_entrega: date | None = None
    tempo_entrega_dias: float | None = Field(default=None, ge=0)
    tempo_entrega_estimado_dias: float | None = Field(default=None, ge=0)
    diferenca_entrega_dias: float | None = None
    entrega_no_prazo: str | None = Field(default=None, max_length=10)


# SCHEMA: resposta de pedido retornada pela API.
class PedidoRead(PedidoCreate):
    model_config = ConfigDict(from_attributes=True)

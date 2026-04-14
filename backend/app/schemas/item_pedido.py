from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class ItemPedidoBase(BaseModel):
    id_produto: str = Field(min_length=1, max_length=32)
    id_vendedor: str = Field(min_length=1, max_length=32)
    preco_BRL: float = Field(ge=0)
    preco_frete: float = Field(ge=0)


# SCHEMA: payload para criacao de item de pedido.
class ItemPedidoCreate(ItemPedidoBase):
    id_pedido: str = Field(min_length=1, max_length=32)
    id_item: int = Field(ge=1)


# SCHEMA: payload para atualizacao parcial de item de pedido.
class ItemPedidoUpdate(BaseModel):
    id_produto: str | None = Field(default=None, min_length=1, max_length=32)
    id_vendedor: str | None = Field(default=None, min_length=1, max_length=32)
    preco_BRL: float | None = Field(default=None, ge=0)
    preco_frete: float | None = Field(default=None, ge=0)


# SCHEMA: resposta de item de pedido retornada pela API.
class ItemPedidoRead(ItemPedidoCreate):
    model_config = ConfigDict(from_attributes=True)

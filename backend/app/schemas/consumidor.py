from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class ConsumidorBase(BaseModel):
    prefixo_cep: str = Field(min_length=1, max_length=10)
    nome_consumidor: str = Field(min_length=1, max_length=255)
    cidade: str = Field(min_length=1, max_length=100)
    estado: str = Field(min_length=2, max_length=2)


# SCHEMA: payload para criacao de consumidor.
class ConsumidorCreate(ConsumidorBase):
    id_consumidor: str = Field(min_length=1, max_length=32)


# SCHEMA: payload para atualizacao parcial de consumidor.
class ConsumidorUpdate(BaseModel):
    prefixo_cep: str | None = Field(default=None, min_length=1, max_length=10)
    nome_consumidor: str | None = Field(default=None, min_length=1, max_length=255)
    cidade: str | None = Field(default=None, min_length=1, max_length=100)
    estado: str | None = Field(default=None, min_length=2, max_length=2)


# SCHEMA: resposta de consumidor retornada pela API.
class ConsumidorRead(ConsumidorBase):
    id_consumidor: str

    model_config = ConfigDict(from_attributes=True)

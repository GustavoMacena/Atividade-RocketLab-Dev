from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class VendedorBase(BaseModel):
    nome_vendedor: str = Field(min_length=1, max_length=255)
    prefixo_cep: str = Field(min_length=1, max_length=10)
    cidade: str = Field(min_length=1, max_length=100)
    estado: str = Field(min_length=2, max_length=2)


# SCHEMA: payload para criacao de vendedor.
class VendedorCreate(VendedorBase):
    id_vendedor: str = Field(min_length=1, max_length=32)


# SCHEMA: payload para atualizacao parcial de vendedor.
class VendedorUpdate(BaseModel):
    nome_vendedor: str | None = Field(default=None, min_length=1, max_length=255)
    prefixo_cep: str | None = Field(default=None, min_length=1, max_length=10)
    cidade: str | None = Field(default=None, min_length=1, max_length=100)
    estado: str | None = Field(default=None, min_length=2, max_length=2)


# SCHEMA: resposta de vendedor retornada pela API.
class VendedorRead(VendedorBase):
    id_vendedor: str

    model_config = ConfigDict(from_attributes=True)

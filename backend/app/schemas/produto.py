from pydantic import BaseModel, ConfigDict, Field


# SCHEMA: campos base reutilizados em entrada e saida.
class ProdutoBase(BaseModel):
    nome_produto: str = Field(min_length=1, max_length=255)
    categoria_produto: str = Field(min_length=1, max_length=100)
    peso_produto_gramas: float | None = Field(default=None, ge=0)
    comprimento_centimetros: float | None = Field(default=None, ge=0)
    altura_centimetros: float | None = Field(default=None, ge=0)
    largura_centimetros: float | None = Field(default=None, ge=0)


# SCHEMA: payload para criacao de produto.
class ProdutoCreate(ProdutoBase):
    id_produto: str = Field(min_length=1, max_length=32)


# SCHEMA: payload para atualizacao parcial de produto.
class ProdutoUpdate(BaseModel):
    nome_produto: str | None = Field(default=None, min_length=1, max_length=255)
    categoria_produto: str | None = Field(default=None, min_length=1, max_length=100)
    peso_produto_gramas: float | None = Field(default=None, ge=0)
    comprimento_centimetros: float | None = Field(default=None, ge=0)
    altura_centimetros: float | None = Field(default=None, ge=0)
    largura_centimetros: float | None = Field(default=None, ge=0)


# SCHEMA: resposta de produto retornada pela API.
class ProdutoRead(ProdutoCreate):
    model_config = ConfigDict(from_attributes=True)


# SCHEMA: resposta com metricas agregadas por produto.
class ProdutoMetricaRead(BaseModel):
    id_produto: str
    media_avaliacao: float | None = None
    quantidade_vendida: int = 0


# SCHEMA: resposta com avaliacoes de um produto e dados do consumidor.
class ProdutoAvaliacaoRead(BaseModel):
    id_avaliacao: str
    id_pedido: str
    nome_consumidor: str
    id_consumidor: str
    id_vendedor: str
    nome_vendedor: str
    descricao_avaliacao: str
    nota: int
    tem_comentario: bool

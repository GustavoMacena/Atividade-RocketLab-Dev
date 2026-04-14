from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.item_pedido import ItemPedido


# MODEL: catalogo de produtos vendidos.
class Produto(Base):
    __tablename__ = "produtos"

    id_produto: Mapped[str] = mapped_column(String(32), primary_key=True)
    nome_produto: Mapped[str] = mapped_column(String(255), nullable=False)
    categoria_produto: Mapped[str] = mapped_column(String(100), nullable=False)
    peso_produto_gramas: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    comprimento_centimetros: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    altura_centimetros: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    largura_centimetros: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # REL: um produto pode aparecer em varios itens de pedido.
    itens_pedidos: Mapped[list["ItemPedido"]] = relationship(back_populates="produto")


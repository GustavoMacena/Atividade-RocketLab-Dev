from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.item_pedido import ItemPedido


# MODEL: dados cadastrais do vendedor.
class Vendedor(Base):
    __tablename__ = "vendedores"

    id_vendedor: Mapped[str] = mapped_column(String(32), primary_key=True)
    nome_vendedor: Mapped[str] = mapped_column(String(255), nullable=False)
    prefixo_cep: Mapped[str] = mapped_column(String(10), nullable=False)
    cidade: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(2), nullable=False)

    # REL: um vendedor pode participar de varios itens de pedido.
    itens_pedidos: Mapped[list["ItemPedido"]] = relationship(back_populates="vendedor")

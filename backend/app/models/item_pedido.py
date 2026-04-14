from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer, PrimaryKeyConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.pedido import Pedido
    from app.models.produto import Produto
    from app.models.vendedor import Vendedor


# MODEL: item individual dentro de um pedido.
class ItemPedido(Base):
    __tablename__ = "itens_pedidos"

    id_pedido: Mapped[str] = mapped_column(
        String(32), ForeignKey("pedidos.id_pedido"), nullable=False
    )
    id_item: Mapped[int] = mapped_column(Integer, nullable=False)
    id_produto: Mapped[str] = mapped_column(
        String(32), ForeignKey("produtos.id_produto"), nullable=False
    )
    id_vendedor: Mapped[str] = mapped_column(
        String(32), ForeignKey("vendedores.id_vendedor"), nullable=False
    )
    preco_BRL: Mapped[float] = mapped_column(Float)
    preco_frete: Mapped[float] = mapped_column(Float)

    # REL: PK composta para identificar o item dentro do pedido.
    __table_args__ = (
        PrimaryKeyConstraint("id_pedido", "id_item"),
    )

    # REL: item pertence a um pedido.
    pedido: Mapped["Pedido"] = relationship(back_populates="itens_pedidos")
    # REL: item referencia um produto.
    produto: Mapped["Produto"] = relationship(back_populates="itens_pedidos")
    # REL: item referencia um vendedor.
    vendedor: Mapped["Vendedor"] = relationship(back_populates="itens_pedidos")

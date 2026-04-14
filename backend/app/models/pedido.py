from __future__ import annotations

from datetime import date, datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.avaliacao_pedido import AvaliacaoPedido
    from app.models.consumidor import Consumidor
    from app.models.item_pedido import ItemPedido


# MODEL: pedido de compra realizado por um consumidor.
class Pedido(Base):
    __tablename__ = "pedidos"

    id_pedido: Mapped[str] = mapped_column(String(32), primary_key=True)
    id_consumidor: Mapped[str] = mapped_column(
        String(32), ForeignKey("consumidores.id_consumidor"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50))
    pedido_compra_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    pedido_entregue_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    data_estimada_entrega: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    tempo_entrega_dias: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    tempo_entrega_estimado_dias: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    diferenca_entrega_dias: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    entrega_no_prazo: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    # REL: cada pedido pertence a um unico consumidor.
    consumidor: Mapped["Consumidor"] = relationship(back_populates="pedidos")
    # REL: um pedido pode ter varios itens.
    itens_pedidos: Mapped[list["ItemPedido"]] = relationship(
        back_populates="pedido",
        cascade="all, delete-orphan",
    )
    # REL: um pedido pode ter varias avaliacoes associadas.
    avaliacoes_pedidos: Mapped[list["AvaliacaoPedido"]] = relationship(
        back_populates="pedido",
        cascade="all, delete-orphan",
    )

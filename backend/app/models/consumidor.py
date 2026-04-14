from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.pedido import Pedido


# MODEL: dados cadastrais do consumidor.
class Consumidor(Base):
    __tablename__ = "consumidores"

    id_consumidor: Mapped[str] = mapped_column(String(32), primary_key=True)
    prefixo_cep: Mapped[str] = mapped_column(String(10), nullable=False)
    nome_consumidor: Mapped[str] = mapped_column(String(255), nullable=False)
    cidade: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(2), nullable=False)

    # REL: um consumidor possui varios pedidos.
    pedidos: Mapped[list["Pedido"]] = relationship(
        back_populates="consumidor",
        cascade="all, delete-orphan",
    )

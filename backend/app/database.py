from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

def _build_connect_args(database_url: str) -> dict[str, bool]:
    # SQLite precisa dessa flag para funcionar bem com o ciclo de vida de requests no FastAPI.
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}


engine: Engine = create_engine(
    settings.DATABASE_URL,
    connect_args=_build_connect_args(settings.DATABASE_URL),
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=Session,
)

class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

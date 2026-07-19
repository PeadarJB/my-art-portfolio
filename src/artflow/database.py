from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from sqlalchemy import URL, event
from sqlmodel import Session, SQLModel, create_engine


def make_engine(database_path: Path):
    database_path = database_path.resolve()
    database_path.parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(
        URL.create("sqlite", database=str(database_path)),
        connect_args={"check_same_thread": False},
    )

    @event.listens_for(engine, "connect")
    def set_sqlite_pragmas(dbapi_connection, _connection_record) -> None:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.close()

    return engine


def initialize_database(database_path: Path):
    engine = make_engine(database_path)
    SQLModel.metadata.create_all(engine)
    return engine


@contextmanager
def session_scope(database_path: Path) -> Iterator[Session]:
    engine = initialize_database(database_path)
    with Session(engine) as session:
        yield session

"""
Comando para popular o banco de dados a partir dos arquivos CSV exportados do Power BI.

"""

from __future__ import annotations

import csv
import sqlite3
from collections.abc import Iterable, Iterator
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
CSV_DIR = BASE_DIR / "Banco de Dados da Atividade"
DB_PATH = BASE_DIR / "database.db"
BATCH_SIZE = 5000


def _clean(value: str | None) -> str | None:
    if value is None:
        return None

    cleaned = value.strip()
    return cleaned if cleaned else None


def _to_float(value: str | None) -> float | None:
    cleaned = _clean(value)
    if cleaned is None:
        return None
    return float(cleaned)


def _to_int(value: str | None) -> int | None:
    cleaned = _clean(value)
    if cleaned is None:
        return None
    return int(cleaned)


def _iter_csv_rows(csv_path: Path) -> Iterator[dict[str, str]]:
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            yield row


def _chunked(iterable: Iterable[tuple], size: int) -> Iterator[list[tuple]]:
    batch: list[tuple] = []
    for item in iterable:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []

    if batch:
        yield batch


def _bulk_insert(
    conn: sqlite3.Connection,
    *,
    table_name: str,
    insert_sql: str,
    rows: Iterable[tuple],
) -> int:
    total = 0
    for batch in _chunked(rows, BATCH_SIZE):
        conn.executemany(insert_sql, batch)
        total += len(batch)

    print(f"{table_name}: {total} registros importados")
    return total


def _iter_categoria_imagens(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        categoria = _clean(row.get("Categoria"))
        link = _clean(row.get("Link"))
        if categoria is None or link is None:
            continue
        yield (categoria, link)


def _iter_consumidores(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        yield (
            row["id_consumidor"],
            row["prefixo_cep"],
            row["nome_consumidor"],
            row["cidade"],
            row["estado"],
        )


def _iter_produtos(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        categoria = _clean(row.get("categoria_produto")) or "sem_categoria"
        yield (
            row["id_produto"],
            row["nome_produto"],
            categoria,
            _to_float(row.get("peso_produto_gramas")),
            _to_float(row.get("comprimento_centimetros")),
            _to_float(row.get("altura_centimetros")),
            _to_float(row.get("largura_centimetros")),
        )


def _iter_vendedores(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        yield (
            row["id_vendedor"],
            row["nome_vendedor"],
            row["prefixo_cep"],
            row["cidade"],
            row["estado"],
        )


def _iter_pedidos(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        yield (
            row["id_pedido"],
            row["id_consumidor"],
            row["status"],
            _clean(row.get("pedido_compra_timestamp")),
            _clean(row.get("pedido_entregue_timestamp")),
            _clean(row.get("data_estimada_entrega")),
            _to_float(row.get("tempo_entrega_dias")),
            _to_float(row.get("tempo_entrega_estimado_dias")),
            _to_float(row.get("diferenca_entrega_dias")),
            _clean(row.get("entrega_no_prazo")),
        )


def _iter_itens_pedidos(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        yield (
            row["id_pedido"],
            _to_int(row.get("id_item")),
            row["id_produto"],
            row["id_vendedor"],
            _to_float(row.get("preco_BRL")),
            _to_float(row.get("preco_frete")),
        )


def _iter_avaliacoes_pedidos(csv_path: Path) -> Iterator[tuple]:
    for row in _iter_csv_rows(csv_path):
        yield (
            row["id_avaliacao"],
            row["id_pedido"],
            _to_int(row.get("avaliacao")),
            _clean(row.get("titulo_comentario")),
            _clean(row.get("comentario")),
            _clean(row.get("data_comentario")),
            _clean(row.get("data_resposta")),
        )


def populate_database() -> None:
    if not CSV_DIR.exists():
        raise FileNotFoundError(f"Diretorio de CSV nao encontrado: {CSV_DIR}")

    if not DB_PATH.exists():
        raise FileNotFoundError(f"Banco de dados nao encontrado: {DB_PATH}")

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("PRAGMA foreign_keys = ON;")

        tables_to_clear = [
            "avaliacoes_pedidos",
            "itens_pedidos",
            "pedidos",
            "vendedores",
            "produtos",
            "consumidores",
            "categoria_imagens",
        ]
        for table in tables_to_clear:
            conn.execute(f"DELETE FROM {table}")

        _bulk_insert(
            conn,
            table_name="categoria_imagens",
            insert_sql="INSERT INTO categoria_imagens (categoria, link) VALUES (?, ?)",
            rows=_iter_categoria_imagens(CSV_DIR / "dim_categoria_imagens.csv"),
        )
        conn.execute(
            "INSERT OR IGNORE INTO categoria_imagens (categoria, link) VALUES (?, ?)",
            ("sem_categoria", "https://placehold.co/600x400?text=Sem+Categoria"),
        )

        _bulk_insert(
            conn,
            table_name="consumidores",
            insert_sql=(
                "INSERT INTO consumidores "
                "(id_consumidor, prefixo_cep, nome_consumidor, cidade, estado) "
                "VALUES (?, ?, ?, ?, ?)"
            ),
            rows=_iter_consumidores(CSV_DIR / "dim_consumidores.csv"),
        )

        _bulk_insert(
            conn,
            table_name="produtos",
            insert_sql=(
                "INSERT INTO produtos "
                "(id_produto, nome_produto, categoria_produto, peso_produto_gramas, "
                "comprimento_centimetros, altura_centimetros, largura_centimetros) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)"
            ),
            rows=_iter_produtos(CSV_DIR / "dim_produtos.csv"),
        )

        _bulk_insert(
            conn,
            table_name="vendedores",
            insert_sql=(
                "INSERT INTO vendedores "
                "(id_vendedor, nome_vendedor, prefixo_cep, cidade, estado) "
                "VALUES (?, ?, ?, ?, ?)"
            ),
            rows=_iter_vendedores(CSV_DIR / "dim_vendedores.csv"),
        )

        _bulk_insert(
            conn,
            table_name="pedidos",
            insert_sql=(
                "INSERT INTO pedidos "
                "(id_pedido, id_consumidor, status, pedido_compra_timestamp, "
                "pedido_entregue_timestamp, data_estimada_entrega, tempo_entrega_dias, "
                "tempo_entrega_estimado_dias, diferenca_entrega_dias, entrega_no_prazo) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            ),
            rows=_iter_pedidos(CSV_DIR / "fat_pedidos.csv"),
        )

        _bulk_insert(
            conn,
            table_name="itens_pedidos",
            insert_sql=(
                "INSERT INTO itens_pedidos "
                "(id_pedido, id_item, id_produto, id_vendedor, preco_BRL, preco_frete) "
                "VALUES (?, ?, ?, ?, ?, ?)"
            ),
            rows=_iter_itens_pedidos(CSV_DIR / "fat_itens_pedidos.csv"),
        )

        _bulk_insert(
            conn,
            table_name="avaliacoes_pedidos",
            insert_sql=(
                "INSERT OR REPLACE INTO avaliacoes_pedidos "
                "(id_avaliacao, id_pedido, avaliacao, titulo_comentario, comentario, "
                "data_comentario, data_resposta) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)"
            ),
            rows=_iter_avaliacoes_pedidos(CSV_DIR / "fat_avaliacoes_pedidos.csv"),
        )

        conn.commit()

    print("Populacao concluida com sucesso.")


if __name__ == "__main__":
    populate_database()

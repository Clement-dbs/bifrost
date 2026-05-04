import sqlite3

DB_PATH = "app/database/config.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS config (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                api_name       TEXT UNIQUE NOT NULL,
                auth_type  TEXT,
                url        TEXT,
                api_key    TEXT,
                format     TEXT,
                headers    TEXT,
                status     TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

def create_config(source: dict):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO config (api_name, auth_type, url, api_key, format, headers, status)
            VALUES (:api_name, :auth_type, :url, :api_key, :format, :headers, :status)
        """, source)

def get_config() -> list:
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM config").fetchall()
        return [dict(row) for row in rows]

def delete_config(name: str):
    with get_connection() as conn:
        conn.execute("DELETE * FROM config WHERE name = ?", (name,))

def update_config(name: str, updates: dict):
    fields = ", ".join(f"{k} = :{k}" for k in updates.keys())
    updates["name"] = name
    with get_connection() as conn:
        conn.execute(f"UPDATE config SET {fields} WHERE name = :name", updates)
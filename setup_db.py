import sqlite3

conn = sqlite3.connect("database.db")

# Users table
conn.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """
)

# Tasks table
conn.execute(
    """
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """
)

conn.commit()
conn.close()

print("Database and tables created successfully!")

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "database.db"

# --- Database helper ---
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# --- Initialize DB ---
def init_db():
    conn = get_db_connection()
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)"
    )
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, completed INTEGER DEFAULT 0)"
    )
    conn.commit()
    conn.close()

init_db()

# --- Signup ---
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password)
        )
        conn.commit()
        return jsonify({"message": "User created"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
    finally:
        conn.close()

# --- Login ---
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        (username, password)
    ).fetchone()
    conn.close()
    if user:
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

# --- Tasks CRUD ---
@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    username = data.get("username")
    title = data.get("title")
    if not username or not title:
        return jsonify({"error": "Username and title required"}), 400

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404

    conn.execute(
        "INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, 0)",
        (user["id"], title)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Task added"}), 201

@app.route("/tasks/<username>", methods=["GET"])
def get_tasks(username):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404
    tasks = conn.execute("SELECT * FROM tasks WHERE user_id = ?", (user["id"],)).fetchall()
    conn.close()
    return jsonify([dict(task) for task in tasks])

if __name__ == "__main__":
    app.run(debug=True)

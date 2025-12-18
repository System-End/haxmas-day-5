import os
import sqlite3

import flask
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Load .env file
load_dotenv()

app = flask.Flask(__name__, static_folder="static", static_url_path="/")

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day"],
    storage_uri="memory://",
)

APP_PASSWORD = os.environ.get("APP_PASSWORD", "changeme")


# Database setup
conn = sqlite3.connect("gifts.db")
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS gifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gift TEXT NOT NULL,
        category TEXT DEFAULT '🎄 Christmas',
        status TEXT DEFAULT 'pending'
    )
""")
conn.commit()
conn.close()


def check_password(request):
    """Check if the password in headers matches."""
    password = request.headers.get("X-Password", "")
    return password == APP_PASSWORD


@app.get("/")
@limiter.exempt
def index():
    return flask.send_from_directory("static", "index.html")


@app.post("/login")
@limiter.limit("10 per minute")
def login():
    data = flask.request.get_json()
    password = data.get("password", "")

    if password == APP_PASSWORD:
        return "", 200
    else:
        return "", 401


@app.post("/gifts")
@limiter.limit("30 per minute")
def create_gift():
    if not check_password(flask.request):
        return "", 401

    data = flask.request.get_json()
    name = data.get("name")
    gift = data.get("gift")
    category = data.get("category", "🎄 Christmas")

    conn = sqlite3.connect("gifts.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO gifts (name, gift, category) VALUES (?, ?, ?)",
        (name, gift, category),
    )
    conn.commit()
    conn.close()

    return "", 201


@app.get("/gifts")
def get_gifts():
    if not check_password(flask.request):
        return "", 401

    conn = sqlite3.connect("gifts.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, gift, category, status FROM gifts ORDER BY id DESC"
    )
    rows = cursor.fetchall()
    conn.close()

    gifts = [
        {
            "id": row[0],
            "name": row[1],
            "gift": row[2],
            "category": row[3],
            "status": row[4],
        }
        for row in rows
    ]
    return flask.jsonify(gifts)


@app.patch("/gifts/<int:gift_id>")
def update_gift(gift_id):
    if not check_password(flask.request):
        return "", 401

    data = flask.request.get_json()
    status = data.get("status")

    conn = sqlite3.connect("gifts.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE gifts SET status = ? WHERE id = ?", (status, gift_id))
    conn.commit()
    conn.close()

    return "", 200


@app.delete("/gifts/<int:gift_id>")
def delete_gift(gift_id):
    if not check_password(flask.request):
        return "", 401

    conn = sqlite3.connect("gifts.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM gifts WHERE id = ?", (gift_id,))
    conn.commit()
    conn.close()

    return "", 200


if __name__ == "__main__":
    app.run(debug=True)

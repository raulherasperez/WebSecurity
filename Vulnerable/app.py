from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Función para conectar a la base de datos
def get_db_connection():
    conn = sqlite3.connect('tienda.db')  # La misma base de datos del script anterior
    conn.row_factory = sqlite3.Row  # Para devolver filas como diccionarios
    return conn

@app.route('/vulnerable-login', methods=['POST'])
def vuln_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Faltan nombre de usuario o contraseña"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Consulta vulnerable a SQL Injection ❌
    query = f"SELECT * FROM usuarios WHERE nombre = '{username}' AND email = '{password}'"
    print("Ejecutando consulta:", query)  # Solo para ver qué se ejecuta

    try:
        cursor.execute(query)
        user = cursor.fetchone()
        conn.close()

        if user:
            return jsonify({"message": "Inicio de sesión exitoso", "user": dict(user)}), 200
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
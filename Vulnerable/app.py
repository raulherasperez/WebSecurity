from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('db/tienda.db')
    conn.row_factory = sqlite3.Row
    return conn

# Ejercicio 1: Login vulnerable
@app.route('/vulnerable-login', methods=['POST'])
def vuln_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Faltan nombre de usuario o contraseña"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    # Vulnerable a SQLi
    query = f"SELECT * FROM usuarios WHERE nombre = '{username}' AND email = '{password}'"
    print("Ejecutando consulta:", query)
    try:
        cursor.execute(query)
        user = cursor.fetchone()
        conn.close()
        if user:
            return jsonify({"success": True, "user": dict(user)}), 200
        else:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Ejercicio 2 y 3: Productos y detalles vulnerables
@app.route('/vulnerable-productos', methods=['GET'])
def vuln_productos():
    search = request.args.get('search', '')
    categoria = request.args.get('categoria', '')
    precio_min = request.args.get('precio_min', '')
    precio_max = request.args.get('precio_max', '')
    stock_min = request.args.get('stock_min', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    # Vulnerable a SQLi
    query = "SELECT * FROM productos WHERE categoria != 'Oculta'"
    if search:
        query += f" AND nombre LIKE '%{search}%'"
    if categoria:
        query += f" AND categoria = '{categoria}'"
    if precio_min:
        query += f" AND precio >= {precio_min}"
    if precio_max:
        query += f" AND precio <= {precio_max}"
    if stock_min:
        query += f" AND stock >= {stock_min}"
    print("Ejecutando consulta:", query)
    try:
        cursor.execute(query)
        productos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(productos), 200
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

# Ejercicio 2: Detalle de producto vulnerable
@app.route('/vulnerable-producto', methods=['GET'])
def vuln_producto():
    prod_id = request.args.get('id', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    # Vulnerable a SQLi
    query = f"SELECT * FROM productos WHERE id = {prod_id}"
    print("Ejecutando consulta:", query)
    try:
        cursor.execute(query)
        producto = cursor.fetchone()
        conn.close()
        if producto:
            return jsonify(dict(producto)), 200
        else:
            return jsonify({"error": "Producto no encontrado"}), 404
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

# Categorías (sin la oculta)
@app.route('/vulnerable-categorias', methods=['GET'])
def vuln_categorias():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT categoria FROM productos WHERE categoria != 'Oculta'")
    categorias = [row['categoria'] for row in cursor.fetchall()]
    conn.close()
    return jsonify(categorias), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True)
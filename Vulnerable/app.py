from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sqlite3
from flask import session
import requests

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.secret_key = "supersecretkey"
def get_db_connection():
    conn = sqlite3.connect('db/vulnerable.db')
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
# Endpoint vulnerable para cambiar la contraseña (sin protección CSRF)
@app.route('/vulnerable-cambiar-password', methods=['POST'])
def vuln_cambiar_password():
    username = 'victima'  # Usuario de prueba
    nuevo = request.form.get('nuevo_password')
    if not nuevo:
        return jsonify({"error": "Falta nueva contraseña"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET password = ? WHERE nombre = ?", (nuevo, username))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "msg": "Contraseña cambiada"}), 200

# Endpoint para restaurar la contraseña original
@app.route('/reset-csrf-password', methods=['POST'])
def reset_csrf_password():
    username = 'victima'
    password_original = 'victima123'  # Cambia esto si tu contraseña original es otra
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET password = ? WHERE nombre = ?", (password_original, username))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "msg": "Contraseña restaurada"}), 200

@app.route('/foro-comentarios', methods=['GET'])
def foro_comentarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM foro_comentarios ORDER BY fecha DESC, id DESC")
    comentarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(comentarios), 200

# Borrar comentario (vulnerable a CSRF)
@app.route('/foro-borrar-comentario', methods=['POST'])
def foro_borrar_comentario():
    id_comentario = request.form.get('id')
    if not id_comentario:
        return jsonify({"success": False, "error": "Falta id"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM foro_comentarios WHERE id = ?", (id_comentario,))
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

# Reiniciar comentarios del foro
@app.route('/foro-reset-comentarios', methods=['POST'])
def foro_reset_comentarios():
    # Borra todos y vuelve a insertar los iniciales
    comentarios_iniciales = [
        ("victima", "¡Hola a todos! Este es mi primer comentario.", "2024-05-01"),
        ("alice", "Bienvenido al foro, victima.", "2024-05-02"),
        ("bob", "¿Alguien ha probado la nueva funcionalidad?", "2024-05-03"),
        ("victima", "Sí, funciona bastante bien.", "2024-05-04"),
    ]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM foro_comentarios")
    cursor.executemany(
        "INSERT INTO foro_comentarios (autor, texto, fecha) VALUES (?, ?, ?)",
        comentarios_iniciales
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200
@app.route('/foro-agregar-comentario', methods=['POST'])
def foro_agregar_comentario():
    texto = request.form.get('texto', '').strip()
    if not texto:
        return jsonify({"success": False, "error": "Falta texto"}), 400
    # Por simplicidad, autor y fecha fijos
    autor = "victima"
    from datetime import date
    fecha = str(date.today())
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO foro_comentarios (autor, texto, fecha) VALUES (?, ?, ?)",
        (autor, texto, fecha)
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, ciudad, fecha_registro, email FROM usuarios")
    usuarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(usuarios), 200

@app.route('/perfil', methods=['GET', 'POST'])
def perfil_usuario():
    usuario_id = request.args.get('id')
    if not usuario_id:
        return jsonify({"error": "Falta parámetro id"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    if request.method == 'POST':
        nuevo_email = request.form.get('email')
        if not nuevo_email:
            conn.close()
            return jsonify({"error": "Falta email"}), 400
        cursor.execute("UPDATE usuarios SET email = ? WHERE id = ?", (nuevo_email, usuario_id))
        conn.commit()
    cursor.execute("SELECT id, nombre, ciudad, fecha_registro, email FROM usuarios WHERE id = ?", (usuario_id,))
    datos = cursor.fetchone()
    conn.close()
    if not datos:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(dict(datos)), 200

@app.route('/login', methods=['POST'])
def bac_login():
    usuario = request.form.get('usuario')
    password = request.form.get('password')
    if not usuario or not password:
        return jsonify({"success": False, "error": "Faltan usuario o contraseña"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre FROM usuarios WHERE nombre = ? AND password = ?", (usuario, password))
    user = cursor.fetchone()
    conn.close()
    if user:
        session['usuario'] = usuario
        session['usuario_id'] = user['id']
        return jsonify({"success": True, "id": user['id'], "nombre": user['nombre']}), 200
    else:
        return jsonify({"success": False, "error": "Credenciales incorrectas"}), 401

# Endpoint para saber si hay sesión activa
@app.route('/whoami', methods=['GET'])
def whoami():
    usuario = session.get('usuario')
    usuario_id = session.get('usuario_id')
    if usuario and usuario_id:
        return jsonify({"loggedIn": True, "usuario": usuario, "id": usuario_id}), 200
    else:
        return jsonify({"loggedIn": False}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True}), 200

@app.route('/ssrf-producto-preview', methods=['GET'])
def ssrf_producto_preview():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Falta el parámetro url"}), 400
    try:
        # Vulnerabilidad SSRF: descarga cualquier URL proporcionada por el usuario
        resp = requests.get(url, timeout=5)
        content_type = resp.headers.get('Content-Type', 'image/jpeg')
        return Response(resp.content, content_type=content_type)
    except Exception as e:
        return jsonify({"error": f"Error al obtener la URL: {e}"}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)
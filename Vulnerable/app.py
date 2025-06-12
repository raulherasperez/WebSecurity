from platform import system
from flask import Flask, request, jsonify, Response, session, send_from_directory
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
import sqlite3
from flask import session
import requests
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.secret_key = "supersecretkey"
def get_db_connection():
    db_path = app.config.get('DATABASE', 'db/vulnerable.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# MODULO 1: Vulnerabilidades SQL
# Ejercicio 1: Login vulnerable
@app.route('/vulnerable-login', methods=['POST'])
def vuln_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    nivel = request.args.get('nivel', 'facil')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if nivel == 'facil':
            # Totalmente vulnerable
            query = f"SELECT * FROM usuarios WHERE nombre = '{username}' AND email = '{password}'"
            cursor.execute(query)
        elif nivel == 'medio':
            # Filtra comillas, pero sigue vulnerable a técnicas básicas
            if "'" in username or '"' in username or "'" in password or '"' in password:
                return jsonify({"success": False, "error": "Caracteres no permitidos"}), 400
            query = f"SELECT * FROM usuarios WHERE nombre = {username} AND email = {password}"
            cursor.execute(query)
        elif nivel == 'dificil':
            # Consultas preparadas, pero muestra errores SQL
            query = "SELECT * FROM usuarios WHERE nombre = ? AND email = ?"
            cursor.execute(query, (username, password))
        else:  # imposible
            # Consultas preparadas y sin mensajes de error
            query = "SELECT * FROM usuarios WHERE nombre = ? AND email = ?"
            cursor.execute(query, (username, password))
        user = cursor.fetchone()
        conn.close()
        if user:
            return jsonify({"success": True, "user": dict(user)}), 200
        else:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401
    except Exception as e:
        conn.close()
        if nivel == 'dificil':
            return jsonify({"success": False, "error": str(e)}), 500
        else:
            return jsonify({"success": False, "error": "Error interno"}), 500

# Ejercicio 2 y 3: Productos y detalles vulnerables
@app.route('/vulnerable-productos', methods=['GET'])
def vuln_productos():
    search = request.args.get('search', '')
    nivel = request.args.get('nivel', 'facil')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if nivel == 'facil':
            query = f"SELECT * FROM productos WHERE nombre LIKE '%{search}%' AND categoria != 'Oculta'"
            cursor.execute(query)
        elif nivel == 'medio':
            if '"' in search:
                return jsonify({"productos": [], "error": "Caracteres no permitidos"}), 400
            if not search:
                search = '%'
            query = f"SELECT * FROM productos WHERE nombre LIKE '{search}' AND categoria != 'Oculta'"
            cursor.execute(query)
        elif nivel == 'dificil':
            query = "SELECT * FROM productos WHERE nombre LIKE ? AND categoria != 'Oculta'"
            cursor.execute(query, (f"%{search}%",))
        else:  # imposible
            query = "SELECT * FROM productos WHERE nombre LIKE ? AND categoria != 'Oculta'"
            cursor.execute(query, (f"%{search}%",))
        productos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"productos": productos}), 200
    except Exception as e:
        conn.close()
        if nivel == 'dificil':
            return jsonify({"productos": [], "error": str(e)}), 500
        else:
            return jsonify({"productos": [], "error": "Error interno"}), 500
        
        
# Ejercicio 2: Detalle de producto vulnerable
@app.route('/vulnerable-producto', methods=['GET'])
def vuln_producto():
    prod_id = request.args.get('id', '')
    nivel = request.args.get('nivel', 'facil')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if nivel == 'facil':
            query = f"SELECT * FROM productos WHERE id = {prod_id}"
            cursor.execute(query)
        elif nivel == 'medio':
            import re
            if not re.match(r'^[0-9\s\-+*/%()=|&]+$', prod_id):
                return jsonify({"error": "Solo se permiten números y operadores aritméticos"}), 400
            query = f"SELECT * FROM productos WHERE id = {prod_id}"
            cursor.execute(query)
        elif nivel == 'dificil':
            query = "SELECT * FROM productos WHERE id = ?"
            cursor.execute(query, (prod_id,))
        else:  # imposible
            query = "SELECT * FROM productos WHERE id = ?"
            cursor.execute(query, (prod_id,))
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
    # Siempre oculta la categoría "Oculta"
    cursor.execute("SELECT DISTINCT categoria FROM productos WHERE categoria != 'Oculta'")
    categorias = [row['categoria'] for row in cursor.fetchall()]
    conn.close()
    return jsonify(categorias), 200

# FIN MODULO 1

# MODULO 3: Vulnerabilidades CSRF

@app.route('/foro-comentarios', methods=['GET'])
def foro_comentarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM foro_comentarios ORDER BY fecha DESC, id DESC")
    comentarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(comentarios), 200


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

@app.route('/set-nivel-csrf', methods=['POST'])
def set_nivel_csrf():
    nivel = request.json.get('nivel', 'facil')
    session['nivel_csrf'] = nivel
    return jsonify({"success": True, "nivel": nivel}), 200

# --- NUEVO: Endpoint para reiniciar el nivel CSRF en la sesión ---
@app.route('/reset-nivel-csrf', methods=['POST'])
def reset_nivel_csrf():
    session.pop('nivel_csrf', None)
    return jsonify({"success": True}), 200

# --- MODIFICADO: Usar nivel CSRF de la sesión en los endpoints sensibles ---

@app.route('/foro-agregar-comentario', methods=['POST'])
def foro_agregar_comentario():
    nivel = session.get('nivel_csrf', 'facil')
    texto = request.form.get('texto', '').strip()
    if not texto:
        return jsonify({"success": False, "error": "Falta texto"}), 400

    # Protección CSRF según nivel
    if nivel == 'medio':
        referer = request.headers.get('Referer', '')
        if not referer.startswith('http://localhost:3000'):
            return jsonify({"success": False, "error": "CSRF bloqueado (Referer)"}), 403
    elif nivel == 'dificil':
        token = request.form.get('csrf_token')
        if token != 'token123':
            return jsonify({"success": False, "error": "CSRF token inválido"}), 403
    elif nivel == 'imposible':
        token = request.form.get('csrf_token')
        if 'csrf_token' not in session or token != session['csrf_token']:
            return jsonify({"success": False, "error": "CSRF token inválido"}), 403
        referer = request.headers.get('Referer', '')
        if not referer.startswith('http://localhost:3000'):
            return jsonify({"success": False, "error": "CSRF bloqueado (Referer)"}), 403

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

@app.route('/foro-borrar-comentario', methods=['POST'])
def foro_borrar_comentario():
    nivel = session.get('nivel_csrf', 'facil')
    id_comentario = request.form.get('id')
    if not id_comentario:
        return jsonify({"success": False, "error": "Falta id"}), 400

    # Protección CSRF según nivel
    if nivel == 'medio':
        referer = request.headers.get('Referer', '')
        if not referer.startswith('http://localhost:3000'):
            return jsonify({"success": False, "error": "CSRF bloqueado (Referer)"}), 403
    elif nivel == 'dificil':
        token = request.form.get('csrf_token')
        if token != 'token123':
            return jsonify({"success": False, "error": "CSRF token inválido"}), 403
    elif nivel == 'imposible':
        token = request.form.get('csrf_token')
        if 'csrf_token' not in session or token != session['csrf_token']:
            return jsonify({"success": False, "error": "CSRF token inválido"}), 403
        referer = request.headers.get('Referer', '')
        if not referer.startswith('http://localhost:3000'):
            return jsonify({"success": False, "error": "CSRF bloqueado (Referer)"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM foro_comentarios WHERE id = ?", (id_comentario,))
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200



# MODULO 4: BAC

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, ciudad, fecha_registro, email FROM usuarios")
    usuarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(usuarios), 200

# --- NUEVO: Endpoint para establecer el nivel BAC en la sesión ---
@app.route('/set-nivel-bac', methods=['POST'])
def set_nivel_bac():
    nivel = request.json.get('nivel', 'facil')
    session['nivel_bac'] = nivel
    return jsonify({"success": True, "nivel": nivel}), 200

# --- NUEVO: Endpoint para reiniciar el nivel BAC en la sesión ---
@app.route('/reset-nivel-bac', methods=['POST'])
def reset_nivel_bac():
    session.pop('nivel_bac', None)
    return jsonify({"success": True}), 200

# --- MODIFICADO: Endpoint de perfil con niveles de dificultad BAC ---
@app.route('/perfil', methods=['GET', 'POST'])
def perfil_usuario():
    usuario_id = request.args.get('id')
    if not usuario_id:
        return jsonify({"error": "Falta parámetro id"}), 400

    nivel = session.get('nivel_bac', 'facil')
    usuario_sesion_id = session.get('usuario_id')

    # Lógica de control de acceso según nivel
    if nivel == 'facil':
        # Sin comprobación: vulnerable total
        pass
    elif nivel == 'medio':
        # Solo frontend protege, el backend sigue vulnerable (igual que fácil)
        pass
    elif nivel == 'dificil':
        # Solo permite modificar tu propio perfil, pero puedes ver otros
        if request.method == 'POST' and str(usuario_id) != str(usuario_sesion_id):
            return jsonify({"error": "No tienes permiso para modificar este perfil"}), 403
    elif nivel == 'imposible':
        # Solo puedes ver y modificar tu propio perfil
        if str(usuario_id) != str(usuario_sesion_id):
            return jsonify({"error": "No tienes permiso para acceder a este perfil"}), 403

    conn = get_db_connection()
    cursor = conn.cursor()
    if request.method == 'POST':
        nuevo_email = request.form.get('email')
        if not nuevo_email:
            conn.close()
            return jsonify({"error": "Falta email"}), 400
        cursor.execute("UPDATE usuarios SET email = ? WHERE id = ?", (nuevo_email, usuario_id))
        conn.commit()
        # Para frontend: indicar éxito
        return jsonify({"success": True}), 200
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

# Modulo 5: SSRF

@app.route('/set-nivel-ssrf', methods=['POST'])
def set_nivel_ssrf():
    nivel = request.json.get('nivel', 'facil')
    session['nivel_ssrf'] = nivel
    return jsonify({"success": True, "nivel": nivel}), 200

@app.route('/reset-nivel-ssrf', methods=['POST'])
def reset_nivel_ssrf():
    session.pop('nivel_ssrf', None)
    return jsonify({"success": True}), 200

@app.route('/ssrf-producto-preview', methods=['GET'])
def ssrf_producto_preview():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Falta el parámetro url"}), 400

    nivel = session.get('nivel_ssrf', 'facil')

    # --- Lógica de dificultad ---
    if nivel == 'medio':
        # Bloquea solo localhost y 127.0.0.1 literal
        if 'localhost' in url or '127.0.0.1' in url:
            return jsonify({"error": "Acceso a localhost bloqueado"}), 403
    elif nivel == 'dificil':
        # Bloquea rangos privados y metadatos cloud (básico)
        import re
        if re.search(r'127\.|localhost|10\.|192\.168\.|169\.254\.169\.254', url):
            return jsonify({"error": "Acceso a IPs privadas/metadatos bloqueado"}), 403
    elif nivel == 'imposible':
        # Solo permite imágenes de Unsplash
        if not url.startswith('https://images.unsplash.com/'):
            return jsonify({"error": "Solo se permiten imágenes de Unsplash"}), 403

    try:
        resp = requests.get(url, timeout=5)
        content_type = resp.headers.get('Content-Type', 'image/jpeg')
        return Response(resp.content, content_type=content_type)
    except Exception as e:
        return jsonify({"error": f"Error al obtener la URL: {e}"}), 500
    
# --- MODULO 6: Broken Authentication ---

# Reseteo de intentos fallidos (para el botón de reinicio)
@app.route('/brokenauth-reset', methods=['POST'])
def brokenauth_reset():
    session.pop('brokenauth_attempts', None)
    session.pop('brokenauth_blocked_until', None)
    return jsonify({"success": True}), 200

@app.route('/set-nivel-brokenauth', methods=['POST'])
def set_nivel_brokenauth():
    nivel = request.json.get('nivel', 'facil')
    session['nivel_brokenauth'] = nivel
    return jsonify({"success": True, "nivel": nivel}), 200

@app.route('/reset-nivel-brokenauth', methods=['POST'])
def reset_nivel_brokenauth():
    session.pop('nivel_brokenauth', None)
    return jsonify({"success": True}), 200

# ...existing code...

@app.route('/brokenauth-login', methods=['POST'])
def brokenauth_login():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    captcha = data.get('captcha', '')
    nivel = session.get('nivel_brokenauth', 'facil')
    print(f"Nivel de dificultad: {nivel}")

    if nivel == 'facil':
        usuarios = {
            "admin": "admin123",
            "victima": "password",
            "usuario": "123456"
        }
    elif nivel == 'medio':
        usuarios = {
            "admin": "qwerty2024",
            "victima": "letmein",
            "usuario": "abc123"
        }
    elif nivel == 'dificil':
        usuarios = {
            "admin": "SuperSegura2024",
            "victima": "DificilPass1",
            "usuario": "Passw0rd!"
        }
    elif nivel == 'imposible':
        usuarios = {
            "admin": "AdminFuerte2024!",
            "victima": "VictimaFuerte2024!",
            "usuario": "UsuarioFuerte2024!"
        }

    # --- Lógica de dificultad ---
    # Nivel difícil e imposible: límite de intentos y bloqueo temporal
    if nivel in ['dificil', 'imposible']:
        now = datetime.utcnow()
        blocked_until = session.get('brokenauth_blocked_until')
        if blocked_until and now < datetime.fromisoformat(blocked_until):
            return jsonify({"success": False, "error": "Demasiados intentos. Inténtalo más tarde."}), 429

        attempts = session.get('brokenauth_attempts', 0)
        # --- En imposible, mostrar captcha si se llega al límite ---
        if nivel == 'imposible':
            captcha_required = session.get('brokenauth_captcha_required', False)
            if attempts >= 5 and not captcha_required:
                session['brokenauth_captcha_required'] = True
                return jsonify({"success": False, "error": "Demasiados intentos. Resuelve el captcha para continuar.", "captcha_required": True}), 429
            if session.get('brokenauth_captcha_required', False):
                # Mockup: el captcha correcto es "1234"
                if captcha != "1234":
                    return jsonify({"success": False, "error": "Captcha incorrecto", "captcha_required": True}), 401
                # Si el captcha es correcto, resetea intentos y permite seguir
                session['brokenauth_attempts'] = 0
                session['brokenauth_captcha_required'] = False

        if attempts >= 5:
            session['brokenauth_blocked_until'] = (now + timedelta(minutes=2)).isoformat()
            session['brokenauth_attempts'] = 0
            session['brokenauth_captcha_required'] = False
            return jsonify({"success": False, "error": "Demasiados intentos. Inténtalo más tarde."}), 429

    # Comprobación de usuario y contraseña
    user_exists = username in usuarios
    password_ok = user_exists and usuarios[username] == password

    # Nivel fácil: mensajes distintos, sin límite de intentos
    if nivel == 'facil':
        if not user_exists:
            return jsonify({"success": False, "error": "Usuario no encontrado"}), 401
        if not password_ok:
            return jsonify({"success": False, "error": "Contraseña incorrecta"}), 401
        session['brokenauth_user'] = username
        return jsonify({"success": True, "user": username}), 200

    # Nivel medio: mensaje genérico, sin límite de intentos
    if nivel == 'medio':
        if not user_exists or not password_ok:
            return jsonify({"success": False, "error": "Usuario o contraseña incorrectos"}), 401
        session['brokenauth_user'] = username
        return jsonify({"success": True, "user": username}), 200

    # Nivel difícil: mensaje genérico, límite de intentos
    if nivel == 'dificil':
        if not user_exists or not password_ok:
            session['brokenauth_attempts'] = session.get('brokenauth_attempts', 0) + 1
            return jsonify({"success": False, "error": "Usuario o contraseña incorrectos"}), 401
        session['brokenauth_attempts'] = 0
        session['brokenauth_user'] = username
        return jsonify({"success": True, "user": username}), 200

    # Nivel imposible: mensaje genérico, límite de intentos, captcha si es necesario (sin restricción de contraseña fuerte)
    if nivel == 'imposible':
        if not user_exists or not password_ok:
            session['brokenauth_attempts'] = session.get('brokenauth_attempts', 0) + 1
            return jsonify({"success": False, "error": "Usuario o contraseña incorrectos"}), 401
        session['brokenauth_attempts'] = 0
        session['brokenauth_user'] = username
        return jsonify({"success": True, "user": username}), 200


# ENTORNO SANDBOX
@app.route('/sandbox/login', methods=['POST'])
def sandbox_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    nivel = request.args.get('nivel', 'facil')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if nivel == 'facil':
            # Vulnerable a SQLi
            query = f"SELECT * FROM usuarios WHERE nombre = '{username}' AND password = '{password}'"
            cursor.execute(query)
        else:
            # Seguro
            query = "SELECT * FROM usuarios WHERE nombre = ? AND password = ?"
            cursor.execute(query, (username, password))
        user = cursor.fetchone()
        conn.close()
        if user:
            session['sandbox_user'] = dict(user)
            return jsonify({"success": True, "user": dict(user)}), 200
        else:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401
    except Exception as e:
        conn.close()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/sandbox/logout', methods=['POST'])
def sandbox_logout():
    session.pop('sandbox_user', None)
    return jsonify({"success": True}), 200

@app.route('/sandbox/whoami', methods=['GET'])
def sandbox_whoami():
    user = session.get('sandbox_user')
    if user:
        return jsonify({"loggedIn": True, "user": user}), 200
    else:
        return jsonify({"loggedIn": False}), 200

# --- SANDBOX: PRODUCTOS ---
@app.route('/sandbox/productos', methods=['GET'])
def sandbox_productos():
    search = request.args.get('search', '')
    categoria = request.args.get('categoria', '')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if not search and not categoria:
            # Sin búsqueda ni filtro: NO mostrar productos de categoría Oculta
            cursor.execute("SELECT * FROM productos WHERE categoria != 'Oculta'")
        else:
            # Si hay búsqueda o filtro, permitir que el usuario fuerce la aparición (vulnerable)
            query = "SELECT * FROM productos WHERE 1=1"
            params = []
            if search:
                # Vulnerable a inyección SQL
                query += f" AND nombre LIKE '%{search}%'"
            if categoria:
                query += f" AND categoria = '{categoria}'"
            cursor.execute(query)
        productos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"productos": productos}), 200
    except Exception as e:
        conn.close()
        return jsonify({"productos": [], "error": str(e)}), 500

@app.route('/sandbox/producto/<int:prod_id>', methods=['GET'])
def sandbox_producto(prod_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos WHERE id = ?", (prod_id,))
    producto = cursor.fetchone()
    if not producto:
        conn.close()
        return jsonify({"error": "Producto no encontrado"}), 404
    # Reviews
    cursor.execute("SELECT * FROM reviews WHERE producto_id = ? ORDER BY fecha DESC", (prod_id,))
    reviews = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"producto": dict(producto), "reviews": reviews}), 200

# --- SANDBOX: REVIEWS (Vulnerable a XSS) ---
@app.route('/sandbox/producto/<int:prod_id>/review', methods=['POST'])
def sandbox_add_review(prod_id):
    data = request.get_json()
    autor = data.get('autor', 'Anónimo')
    texto = data.get('texto', '')
    fecha = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO reviews (producto_id, autor, texto, fecha) VALUES (?, ?, ?, ?)",
        (prod_id, autor, texto, fecha)
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

@app.route('/sandbox/cambiar-email', methods=['POST'])
def sandbox_cambiar_email():
    # No se comprueba autenticación ni CSRF
    data = request.form
    username = data.get('username')
    nuevo_email = data.get('nuevo_email')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET email = ? WHERE nombre = ?", (nuevo_email, username))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "msg": "Email actualizado"}), 200

# Obtener todos los usuarios (con rol)
@app.route('/sandbox/admin/usuarios', methods=['GET'])
def sandbox_admin_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, email, rol FROM usuarios")
    usuarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"usuarios": usuarios}), 200

# Ver detalles de usuario (incluye historial de compras)
@app.route('/sandbox/admin/usuario/<int:user_id>', methods=['GET'])
def sandbox_admin_usuario_detalle(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, email, rol FROM usuarios WHERE id = ?", (user_id,))
    usuario = cursor.fetchone()
    if not usuario:
        conn.close()
        return jsonify({"error": "Usuario no encontrado"}), 404
    cursor.execute("""
        SELECT c.id, p.nombre, p.precio, c.fecha
        FROM compras c
        JOIN productos p ON c.producto_id = p.id
        WHERE c.usuario_id = ?
        ORDER BY c.fecha DESC
    """, (user_id,))
    compras = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({"usuario": dict(usuario), "compras": compras}), 200

# Editar usuario (nombre, email, rol)
@app.route('/sandbox/admin/usuario/<int:user_id>/editar', methods=['POST'])
def sandbox_admin_usuario_editar(user_id):
    data = request.json
    nombre = data.get('nombre')
    email = data.get('email')
    rol = data.get('rol')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?",
        (nombre, email, rol, user_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

# Eliminar usuario
@app.route('/sandbox/admin/usuario/<int:user_id>/eliminar', methods=['POST'])
def sandbox_admin_usuario_eliminar(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
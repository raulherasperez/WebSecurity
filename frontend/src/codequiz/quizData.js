const CODE_QUIZ = [
  // --- SQLi ---
  {
    id: 1,
    type: "sqli",
    title: "Inyección SQL en login",
    code: [
      "username = request.form['username']",
      "password = request.form['password']",
      "query = f\"SELECT * FROM usuarios WHERE nombre = '{username}' AND password = '{password}'\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque concatena directamente los datos del usuario en la consulta SQL."
  },
  {
    id: 2,
    type: "sqli",
    title: "Inyección SQL en búsqueda de productos",
    code: [
      "search = request.args.get('search', '')",
      "query = f\"SELECT * FROM productos WHERE nombre LIKE '%{search}%'\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque inserta el parámetro de búsqueda sin sanitizar en la consulta SQL."
  },
  {
    id: 3,
    type: "sqli",
    title: "Inyección SQL en filtro de categoría",
    code: [
      "categoria = request.args.get('categoria', '')",
      "query = f\"SELECT * FROM productos WHERE categoria = '{categoria}'\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el valor de categoría no está parametrizado."
  },
  {
    id: 4,
    type: "sqli",
    title: "Inyección SQL en eliminación de usuario",
    code: [
      "user_id = request.args.get('id')",
      "cursor.execute(f\"DELETE FROM usuarios WHERE id = {user_id}\")"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el id se inserta directamente en la consulta."
  },
  {
    id: 5,
    type: "sqli",
    title: "Inyección SQL en actualización de contraseña",
    code: [
      "username = request.form['username']",
      "new_pass = request.form['new_pass']",
      "cursor.execute(f\"UPDATE usuarios SET password = '{new_pass}' WHERE nombre = '{username}'\")"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque ambos valores se insertan directamente en la consulta."
  },
  {
    id: 6,
    type: "sqli",
    title: "Inyección SQL en consulta de pedidos",
    code: [
      "pedido_id = request.args.get('pedido_id')",
      "query = f\"SELECT * FROM pedidos WHERE id = {pedido_id}\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el id no está parametrizado."
  },
  {
    id: 7,
    type: "sqli",
    title: "Inyección SQL en login con OR 1=1",
    code: [
      "username = request.form['username']",
      "password = request.form['password']",
      "query = f\"SELECT * FROM usuarios WHERE nombre = '{username}' AND password = '{password}'\"",
      "user = cursor.execute(query).fetchone()"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable a inyecciones como ' OR 1=1 --."
  },
  {
    id: 8,
    type: "sqli",
    title: "Inyección SQL en búsqueda avanzada",
    code: [
      "filtro = request.args.get('filtro')",
      "query = f\"SELECT * FROM productos WHERE descripcion LIKE '%{filtro}%'\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el filtro no está escapado ni parametrizado."
  },
  {
    id: 9,
    type: "sqli",
    title: "Inyección SQL en consulta de reviews",
    code: [
      "prod_id = request.args.get('prod_id')",
      "query = f\"SELECT * FROM reviews WHERE producto_id = {prod_id}\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el id se inserta directamente."
  },
  {
    id: 10,
    type: "sqli",
    title: "Inyección SQL en login con LIKE",
    code: [
      "username = request.form['username']",
      "query = f\"SELECT * FROM usuarios WHERE nombre LIKE '%{username}%'\"",
      "cursor.execute(query)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el nombre no está parametrizado."
  },

  // --- XSS ---
  {
    id: 11,
    type: "xss",
    title: "XSS en comentarios",
    code: [
      "comentario = request.form['comentario']",
      "db.save(comentario)",
      "return f'<div>{comentario}</div>'"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque muestra datos del usuario sin escape, permitiendo XSS."
  },
  {
    id: 12,
    type: "xss",
    title: "XSS reflejado en parámetro GET",
    code: [
      "nombre = request.args.get('nombre')",
      "return f'<h1>Hola {nombre}</h1>'"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque muestra un parámetro GET sin escape en la respuesta HTML."
  },
  {
    id: 13,
    type: "xss",
    title: "XSS almacenado en perfil de usuario",
    code: [
      "bio = request.form['bio']",
      "user.bio = bio",
      "db.session.commit()",
      "return render_template('perfil.html', user=user)"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 permite guardar código malicioso en la bio del usuario."
  },
  {
    id: 14,
    type: "xss",
    title: "XSS en resultados de búsqueda",
    code: [
      "q = request.args.get('q')",
      "return f'<div>Resultados para: {q}</div>'"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque muestra el parámetro de búsqueda sin escape."
  },
  {
    id: 15,
    type: "xss",
    title: "XSS en nombre de producto",
    code: [
      "nombre = request.form['nombre']",
      "db.save_producto(nombre)",
      "return f'<span>{nombre}</span>'"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque muestra el nombre del producto sin escape."
  },
  {
    id: 16,
    type: "xss",
    title: "XSS en mensajes de error",
    code: [
      "error = request.args.get('error')",
      "return f'<div class=\"error\">{error}</div>'"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque muestra el mensaje de error sin escape."
  },
  {
    id: 17,
    type: "xss",
    title: "XSS en chat",
    code: [
      "mensaje = request.form['mensaje']",
      "db.save(mensaje)",
      "return f'<li>{mensaje}</li>'"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque muestra el mensaje sin escape."
  },
  {
    id: 18,
    type: "xss",
    title: "XSS en etiquetas personalizadas",
    code: [
      "etiqueta = request.form['etiqueta']",
      "return f'<b>{etiqueta}</b>'"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque muestra la etiqueta sin escape."
  },
  {
    id: 19,
    type: "xss",
    title: "XSS en campo de dirección",
    code: [
      "direccion = request.form['direccion']",
      "return f'<address>{direccion}</address>'"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque muestra la dirección sin escape."
  },
  {
    id: 20,
    type: "xss",
    title: "XSS en título de página",
    code: [
      "titulo = request.args.get('titulo')",
      "return f'<title>{titulo}</title>'"
    ],
    vulnerableLine: 1,
    explanation: "La línea 2 es vulnerable porque el título no está escapado."
  },

  // --- CSRF ---
  {
    id: 21,
    type: "csrf",
    title: "CSRF en cambio de email",
    code: [
      "def cambiar_email():",
      "    email = request.form['email']",
      "    user = get_current_user()",
      "    user.email = email",
      "    db.session.commit()",
      "    return 'Email actualizado'"
    ],
    vulnerableLine: 0,
    explanation: "La función no comprueba ningún token CSRF, por lo que es vulnerable a CSRF."
  },
  {
    id: 22,
    type: "csrf",
    title: "CSRF en compra de producto",
    code: [
      "def comprar():",
      "    prod_id = request.form['prod_id']",
      "    user = get_current_user()",
      "    realizar_compra(user, prod_id)",
      "    return 'Compra realizada'"
    ],
    vulnerableLine: 0,
    explanation: "La función permite realizar una compra sin comprobar token CSRF."
  },
  {
    id: 23,
    type: "csrf",
    title: "CSRF en cambio de contraseña",
    code: [
      "def cambiar_pass():",
      "    nueva = request.form['nueva']",
      "    user = get_current_user()",
      "    user.password = nueva",
      "    db.session.commit()"
    ],
    vulnerableLine: 0,
    explanation: "No hay comprobación de token CSRF en la función."
  },
  {
    id: 24,
    type: "csrf",
    title: "CSRF en añadir dirección",
    code: [
      "def add_direccion():",
      "    direccion = request.form['direccion']",
      "    user = get_current_user()",
      "    user.direccion = direccion",
      "    db.session.commit()"
    ],
    vulnerableLine: 0,
    explanation: "No hay protección CSRF en la función."
  },
  {
    id: 25,
    type: "csrf",
    title: "CSRF en añadir tarjeta",
    code: [
      "def add_tarjeta():",
      "    tarjeta = request.form['tarjeta']",
      "    user = get_current_user()",
      "    user.tarjeta = tarjeta",
      "    db.session.commit()"
    ],
    vulnerableLine: 0,
    explanation: "No hay comprobación de token CSRF en la función."
  },
  {
    id: 26,
    type: "csrf",
    title: "CSRF en eliminar cuenta",
    code: [
      "def eliminar_cuenta():",
      "    user = get_current_user()",
      "    db.session.delete(user)",
      "    db.session.commit()"
    ],
    vulnerableLine: 0,
    explanation: "No hay protección CSRF en la función."
  },
  {
    id: 27,
    type: "csrf",
    title: "CSRF en añadir comentario",
    code: [
      "def add_comentario():",
      "    comentario = request.form['comentario']",
      "    db.save(comentario)"
    ],
    vulnerableLine: 0,
    explanation: "No hay comprobación de token CSRF en la función."
  },
  {
    id: 28,
    type: "csrf",
    title: "CSRF en actualizar perfil",
    code: [
      "def actualizar_perfil():",
      "    datos = request.form",
      "    user = get_current_user()",
      "    user.nombre = datos['nombre']",
      "    user.email = datos['email']",
      "    db.session.commit()"
    ],
    vulnerableLine: 0,
    explanation: "No hay comprobación de token CSRF en la función."
  },
  {
    id: 29,
    type: "csrf",
    title: "CSRF en añadir producto a favoritos",
    code: [
      "def add_favorito():",
      "    prod_id = request.form['prod_id']",
      "    user = get_current_user()",
      "    user.favoritos.append(prod_id)",
      "    db.session.commit()"
    ],
    vulnerableLine: 0,
    explanation: "No hay comprobación de token CSRF en la función."
  },
  {
    id: 30,
    type: "csrf",
    title: "CSRF en enviar mensaje privado",
    code: [
      "def enviar_mp():",
      "    destinatario = request.form['destinatario']",
      "    mensaje = request.form['mensaje']",
      "    db.save_mp(destinatario, mensaje)"
    ],
    vulnerableLine: 0,
    explanation: "No hay comprobación de token CSRF en la función."
  },

  // --- BAC ---
  {
    id: 31,
    type: "bac",
    title: "BAC en panel de administración",
    code: [
      "@app.route('/admin/usuarios')",
      "def admin_usuarios():",
      "    conn = get_db_connection()",
      "    cursor = conn.cursor()",
      "    cursor.execute('SELECT * FROM usuarios')",
      "    return jsonify(cursor.fetchall())"
    ],
    vulnerableLine: 1,
    explanation: "La función no comprueba si el usuario es admin antes de mostrar los usuarios."
  },
  {
    id: 32,
    type: "bac",
    title: "BAC en edición de usuario",
    code: [
      "@app.route('/admin/usuario/<int:id>/editar', methods=['POST'])",
      "def editar_usuario(id):",
      "    data = request.json",
      "    cursor.execute('UPDATE usuarios SET email = ? WHERE id = ?', (data['email'], id))",
      "    conn.commit()",
      "    return jsonify({'success': True})"
    ],
    vulnerableLine: 1,
    explanation: "La función permite editar usuarios sin comprobar el rol del usuario autenticado."
  },
  {
    id: 33,
    type: "bac",
    title: "BAC en eliminación de usuario",
    code: [
      "@app.route('/admin/usuario/<int:id>/eliminar', methods=['POST'])",
      "def eliminar_usuario(id):",
      "    cursor.execute('DELETE FROM usuarios WHERE id = ?', (id,))",
      "    conn.commit()",
      "    return jsonify({'success': True})"
    ],
    vulnerableLine: 1,
    explanation: "La función permite eliminar usuarios sin comprobar el rol del usuario autenticado."
  },
  {
    id: 34,
    type: "bac",
    title: "BAC en acceso a historial de compras",
    code: [
      "@app.route('/compras/<int:user_id>')",
      "def ver_compras(user_id):",
      "    compras = get_compras(user_id)",
      "    return jsonify(compras)"
    ],
    vulnerableLine: 1,
    explanation: "La función permite ver compras de cualquier usuario sin comprobar si es el dueño."
  },
  {
    id: 35,
    type: "bac",
    title: "BAC en subida de productos",
    code: [
      "@app.route('/admin/productos/subir', methods=['POST'])",
      "def subir_producto():",
      "    datos = request.form",
      "    db.save_producto(datos)"
    ],
    vulnerableLine: 1,
    explanation: "La función permite subir productos sin comprobar si el usuario es admin."
  },
  {
    id: 36,
    type: "bac",
    title: "BAC en acceso a panel de moderación",
    code: [
      "@app.route('/moderacion')",
      "def moderacion():",
      "    return render_template('moderacion.html')"
    ],
    vulnerableLine: 1,
    explanation: "La función permite acceder al panel de moderación sin comprobar permisos."
  },
  {
    id: 37,
    type: "bac",
    title: "BAC en edición de reviews",
    code: [
      "@app.route('/admin/review/<int:id>/editar', methods=['POST'])",
      "def editar_review(id):",
      "    data = request.json",
      "    cursor.execute('UPDATE reviews SET texto = ? WHERE id = ?', (data['texto'], id))",
      "    conn.commit()"
    ],
    vulnerableLine: 1,
    explanation: "La función permite editar reviews sin comprobar si el usuario es admin."
  },
  {
    id: 38,
    type: "bac",
    title: "BAC en acceso a logs",
    code: [
      "@app.route('/admin/logs')",
      "def ver_logs():",
      "    logs = get_logs()",
      "    return jsonify(logs)"
    ],
    vulnerableLine: 1,
    explanation: "La función permite ver logs sin comprobar si el usuario es admin."
  },
  {
    id: 39,
    type: "bac",
    title: "BAC en cambio de rol",
    code: [
      "@app.route('/admin/usuario/<int:id>/rol', methods=['POST'])",
      "def cambiar_rol(id):",
      "    nuevo_rol = request.form['rol']",
      "    cursor.execute('UPDATE usuarios SET rol = ? WHERE id = ?', (nuevo_rol, id))",
      "    conn.commit()"
    ],
    vulnerableLine: 1,
    explanation: "La función permite cambiar el rol de cualquier usuario sin comprobar permisos."
  },
  {
    id: 40,
    type: "bac",
    title: "BAC en descarga de base de datos",
    code: [
      "@app.route('/admin/descargar-db')",
      "def descargar_db():",
      "    return send_file('db.sqlite')"
    ],
    vulnerableLine: 1,
    explanation: "La función permite descargar la base de datos sin comprobar si el usuario es admin."
  },

  // --- SSRF ---
  {
    id: 41,
    type: "ssrf",
    title: "SSRF en previsualización de imagen",
    code: [
      "@app.route('/preview-img')",
      "def preview_img():",
      "    url = request.args.get('url')",
      "    resp = requests.get(url)",
      "    return Response(resp.content, content_type=resp.headers.get('Content-Type', 'image/jpeg'))"
    ],
    vulnerableLine: 3,
    explanation: "La línea 4 es vulnerable porque permite al usuario forzar al servidor a hacer peticiones a URLs arbitrarias."
  },
  {
    id: 42,
    type: "ssrf",
    title: "SSRF en importación de datos",
    code: [
      "def importar():",
      "    url = request.form['url']",
      "    datos = requests.get(url).json()",
      "    guardar_en_db(datos)"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL a la que el servidor hace la petición."
  },
  {
    id: 43,
    type: "ssrf",
    title: "SSRF en descarga de avatar",
    code: [
      "def descargar_avatar():",
      "    url = request.args.get('url')",
      "    avatar = requests.get(url).content",
      "    return send_file(BytesIO(avatar), mimetype='image/png')"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite descargar archivos arbitrarios desde el servidor."
  },
  {
    id: 44,
    type: "ssrf",
    title: "SSRF en comprobación de enlaces",
    code: [
      "def comprobar_enlace():",
      "    url = request.form['url']",
      "    resp = requests.head(url)",
      "    return resp.status_code"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL de la petición."
  },
  {
    id: 45,
    type: "ssrf",
    title: "SSRF en integración con API externa",
    code: [
      "def integrar_api():",
      "    api_url = request.form['api_url']",
      "    datos = requests.get(api_url).json()",
      "    procesar(datos)"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL de la petición."
  },
  {
    id: 46,
    type: "ssrf",
    title: "SSRF en webhook",
    code: [
      "def enviar_webhook():",
      "    url = request.form['url']",
      "    requests.post(url, json={'evento': 'test'})"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL de la petición."
  },
  {
    id: 47,
    type: "ssrf",
    title: "SSRF en preview de PDF",
    code: [
      "def preview_pdf():",
      "    url = request.args.get('url')",
      "    pdf = requests.get(url).content",
      "    return send_file(BytesIO(pdf), mimetype='application/pdf')"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite descargar archivos arbitrarios desde el servidor."
  },
  {
    id: 48,
    type: "ssrf",
    title: "SSRF en comprobación de imagen",
    code: [
      "def comprobar_imagen():",
      "    url = request.form['url']",
      "    resp = requests.get(url)",
      "    return resp.status_code"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL de la petición."
  },
  {
    id: 49,
    type: "ssrf",
    title: "SSRF en integración de feeds RSS",
    code: [
      "def importar_feed():",
      "    feed_url = request.form['feed_url']",
      "    feed = requests.get(feed_url).text",
      "    procesar_feed(feed)"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL de la petición."
  },
  {
    id: 50,
    type: "ssrf",
    title: "SSRF en comprobación de estado de servicio",
    code: [
      "def comprobar_estado():",
      "    url = request.args.get('url')",
      "    resp = requests.get(url)",
      "    return resp.status_code"
    ],
    vulnerableLine: 2,
    explanation: "La línea 3 es vulnerable porque permite al usuario controlar la URL de la petición."
  }
];

export default CODE_QUIZ;
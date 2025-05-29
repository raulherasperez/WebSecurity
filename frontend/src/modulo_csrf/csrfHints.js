const pistas = {
  1: {
    facil: "Crea un archivo HTML externo con un formulario que haga POST a /foro-borrar-comentario con el parámetro id del comentario que quieras borrar. Ábrelo en tu navegador mientras tienes la sesión iniciada en el foro.",
    medio: "El backend verifica el Referer. Intenta hacer el ataque CSRF desde un origen distinto y observa si es bloqueado. ¿Puedes modificar el Referer?",
    dificil: "Ahora necesitas un token CSRF. ¿Puedes adivinarlo o reutilizar un valor predecible como 'token123' en tu ataque?",
    imposible: "El backend exige un token CSRF robusto y verifica el Referer. No deberías poder realizar el ataque CSRF en este nivel."
  }
};

const soluciones = {
  1: {
    facil: (
      <div>
        <ol>
          <li>Observa el <b>ID</b> del comentario que quieres borrar en el foro.</li>
          <li>
            Crea un archivo HTML externo con:
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6 }}>
{String.raw`<form action="http://localhost:5001/foro-borrar-comentario" method="POST">
  <input type="hidden" name="id" value="1">
  <input type="submit" value="Borrar">
</form>
<script>document.forms[0].submit()</script>`}
            </pre>
          </li>
          <li>Ábrelo en tu navegador mientras tienes la sesión iniciada en el foro. El comentario será borrado.</li>
        </ol>
      </div>
    ),
    medio: (
      <div>
        <ol>
          <li>El backend verifica el Referer. Si haces el ataque desde un archivo local (file://) o un dominio distinto, será bloqueado.</li>
          <li>Prueba a modificar el Referer con extensiones o herramientas, o intenta desde el mismo dominio.</li>
          <li>Si el Referer es válido, el ataque funcionará; si no, será bloqueado.</li>
        </ol>
      </div>
    ),
    dificil: (
      <div>
        <ol>
          <li>El backend exige un token CSRF. Prueba a enviar el valor <code>token123</code> como <code>csrf_token</code> en el formulario.</li>
          <li>
            Ejemplo:
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6 }}>
{String.raw`<form action="http://localhost:5001/foro-borrar-comentario" method="POST">
  <input type="hidden" name="id" value="1">
  <input type="hidden" name="csrf_token" value="token123">
  <input type="submit" value="Borrar">
</form>
<script>document.forms[0].submit()</script>`}
            </pre>
          </li>
          <li>Si el token es correcto, el comentario será borrado.</li>
        </ol>
      </div>
    ),
    imposible: (
      <div>
        <p>
          El backend exige un token CSRF robusto y verifica el Referer. No puedes realizar el ataque CSRF, ya que el token es único por sesión y no puedes obtenerlo desde un sitio externo.
        </p>
      </div>
    )
  }
};

const explicacionNivel = {
  facil: (
    <div>
      <p>
        <strong>Nivel Fácil:</strong> El backend no implementa ninguna protección CSRF. Cualquier petición POST válida con la cookie de sesión será aceptada, sin importar su origen.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`@app.route('/foro-borrar-comentario', methods=['POST'])
def foro_borrar_comentario():
    id_comentario = request.form.get('id')
    # ...borra el comentario...
    return jsonify({"success": True}), 200
`}
      </pre>
      <p>
        Es el escenario más vulnerable y didáctico para practicar ataques CSRF.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        <strong>Nivel Medio:</strong> El backend verifica el encabezado <code>Referer</code> para asegurarse de que la petición proviene del mismo dominio. Si el Referer no es válido, la petición es bloqueada.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`referer = request.headers.get('Referer', '')
if not referer.startswith('http://localhost:3000'):
    return jsonify({"success": False, "error": "CSRF bloqueado (Referer)"}), 403
`}
      </pre>
      <p>
        Esta protección es mejor que nada, pero puede ser burlada si el atacante logra manipular el Referer o si el navegador no lo envía.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        <strong>Nivel Difícil:</strong> El backend exige un token CSRF, pero es un valor fijo y predecible (<code>token123</code>). Si el atacante conoce el valor, puede incluirlo en su ataque.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`token = request.form.get('csrf_token')
if token != 'token123':
    return jsonify({"success": False, "error": "CSRF token inválido"}), 403
`}
      </pre>
      <p>
        Esta protección es débil, pero muestra la importancia de usar tokens aleatorios y únicos por sesión.
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        <strong>Nivel Imposible:</strong> El backend exige un token CSRF robusto (único por sesión) y verifica el Referer. Solo el usuario legítimo puede obtener el token y enviarlo correctamente.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`token = request.form.get('csrf_token')
if 'csrf_token' not in session or token != session['csrf_token']:
    return jsonify({"success": False, "error": "CSRF token inválido"}), 403
referer = request.headers.get('Referer', '')
if not referer.startswith('http://localhost:3000'):
    return jsonify({"success": False, "error": "CSRF bloqueado (Referer)"}), 403
`}
      </pre>
      <p>
        Es el nivel más seguro y realista para una aplicación protegida contra CSRF.
      </p>
    </div>
  )
};

export { pistas, soluciones, explicacionNivel };
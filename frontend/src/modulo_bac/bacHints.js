const pistas = {
  facil: "No hay ningún control de acceso en el backend. Cambia el parámetro id en la URL o petición y accede a cualquier perfil.",
  medio: "El frontend oculta opciones, pero el backend sigue sin comprobar permisos. Cambia el parámetro id en la petición y podrás acceder a otros perfiles.",
  dificil: "Solo puedes modificar tu propio perfil, pero puedes ver los de otros usuarios cambiando el parámetro id.",
  imposible: "El backend comprueba siempre que solo puedes ver y modificar tu propio perfil. No podrás acceder a datos ajenos aunque cambies el parámetro id."
};

const soluciones = {
  facil: (
    <ol>
      <li>Inicia sesión como un usuario normal.</li>
      <li>Accede a tu perfil.</li>
      <li>Cambia el parámetro <code>id</code> en la URL o petición por el de otro usuario.</li>
      <li>Podrás ver y modificar datos ajenos sin restricción.</li>
    </ol>
  ),
  medio: (
    <ol>
      <li>Inicia sesión y accede a tu perfil.</li>
      <li>El frontend puede ocultar opciones, pero si cambias el parámetro <code>id</code> en la petición, podrás acceder a otros perfiles igualmente.</li>
    </ol>
  ),
  dificil: (
    <ol>
      <li>Inicia sesión y accede a tu perfil.</li>
      <li>Cambia el parámetro <code>id</code> en la URL o petición por el de otro usuario.</li>
      <li>Podrás ver datos ajenos, pero solo modificar tu propio perfil.</li>
    </ol>
  ),
  imposible: (
    <ol>
      <li>Inicia sesión y accede a tu perfil.</li>
      <li>Intenta cambiar el parámetro <code>id</code> por el de otro usuario.</li>
      <li>El backend te impedirá ver o modificar datos ajenos.</li>
    </ol>
  )
};

const explicacionNivel = {
  facil: (
    <div>
      <p>
        <strong>Nivel Fácil:</strong> El backend no realiza ninguna comprobación de permisos. Cualquier usuario puede acceder o modificar los datos de cualquier otro usuario simplemente cambiando el parámetro <code>id</code> en la URL o petición.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`@app.route('/perfil', methods=['GET', 'POST'])
def perfil_usuario():
    usuario_id = request.args.get('id')
    # ...sin comprobación de permisos...
`}
      </pre>
      <p>
        Esto permite explotar fácilmente la vulnerabilidad de Broken Access Control.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        <strong>Nivel Medio:</strong> El frontend oculta opciones o botones, pero el backend sigue sin comprobar permisos. Un atacante puede modificar el parámetro <code>id</code> en la petición y acceder a datos ajenos.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`// El backend sigue igual que en nivel fácil, solo el frontend protege
`}
      </pre>
      <p>
        Nunca confíes en el frontend para la seguridad.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        <strong>Nivel Difícil:</strong> El backend solo permite modificar tu propio perfil, pero puedes ver los de otros usuarios. Así, la lectura sigue siendo vulnerable, pero la modificación está protegida.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if request.method == 'POST' and usuario_id != usuario_sesion_id:
    return jsonify({"error": "No tienes permiso para modificar este perfil"}), 403
`}
      </pre>
      <p>
        Es un avance, pero aún puedes ver datos ajenos.
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        <strong>Nivel Imposible:</strong> El backend comprueba siempre que solo puedes ver y modificar tu propio perfil. No puedes acceder a datos ajenos aunque cambies el parámetro <code>id</code>.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if usuario_id != usuario_sesion_id:
    return jsonify({"error": "No tienes permiso para acceder a este perfil"}), 403
`}
      </pre>
      <p>
        Es el nivel más seguro y realista.
      </p>
    </div>
  )
};

export { pistas, soluciones, explicacionNivel };
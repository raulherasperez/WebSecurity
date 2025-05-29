const pistas = {
  facil: "Puedes usar cualquier URL, incluyendo direcciones internas como localhost, 127.0.0.1 o metadatos cloud. El backend no valida nada.",
  medio: "El backend bloquea 'localhost' y '127.0.0.1', pero puedes probar variantes como 127.1, 0x7f000001 o direcciones privadas.",
  dificil: "El backend bloquea rangos privados y metadatos cloud, pero puedes intentar técnicas de evasión como hexadecimal, DNS rebinding o dominios que resuelvan a IPs internas.",
  imposible: "Solo se permiten imágenes de Unsplash. El backend valida correctamente la URL y no puedes acceder a recursos internos ni externos arbitrarios."
};

const soluciones = {
  facil: (
    <ol>
      <li>Introduce una URL interna como <code>http://localhost:5001/usuarios</code> o <code>http://169.254.169.254/latest/meta-data/</code> en el formulario de vista previa.</li>
      <li>El backend accederá y mostrará el contenido interno o sensible.</li>
      <li>¡Has explotado la vulnerabilidad SSRF!</li>
    </ol>
  ),
  medio: (
    <ol>
      <li>Introduce <code>http://127.0.0.1:5001/usuarios</code> y verás que está bloqueado.</li>
      <li>Prueba variantes como <code>http://127.1:5001/usuarios</code> o <code>http://0x7f000001:5001/usuarios</code>.</li>
      <li>El backend puede permitir estas variantes y mostrarte datos internos.</li>
      <p>¿No funciona? ¡No te preocupes! Probablemente estarás usando Windows. En algunos sistemas operativos, las variantes de las direcciones IPs
        no funcionan.
      </p>
    </ol>
    
  ),
  dificil: (
    <ol>
      <li>Introduce una IP privada (<code>http://192.168.1.10:8080/</code>) o metadatos cloud (<code>http://169.254.169.254/</code>).</li>
      <li>El backend debería bloquearlas, pero puedes intentar técnicas avanzadas como hexadecimal, DNS rebinding o dominios que resuelvan a IPs internas.</li>
      <li>Si logras saltar el filtro, explotarás la vulnerabilidad.</li>
    </ol>
  ),
  imposible: (
    <ol>
      <li>Solo puedes usar URLs de imágenes de Unsplash (<code>https://images.unsplash.com/...</code>).</li>
      <li>Cualquier otro destino será bloqueado por el backend.</li>
      <li>No puedes explotar SSRF en este nivel.</li>
    </ol>
  )
};

const explicacionNivel = {
  facil: (
    <div>
      <p>
        <strong>Nivel Fácil:</strong> El backend no valida la URL proporcionada por el usuario. Puedes acceder a cualquier recurso interno o externo, incluyendo servicios internos, metadatos cloud y más.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`@app.route('/ssrf-producto-preview')
def ssrf_producto_preview():
    url = request.args.get('url')
    # Sin validación
    resp = requests.get(url)
    return Response(resp.content)
`}
      </pre>
      <p>
        Esto permite explotar SSRF fácilmente.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        <strong>Nivel Medio:</strong> El backend bloquea solo 'localhost' y '127.0.0.1', pero puedes evadir el filtro usando variantes como 127.1, 0x7f000001, etc.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if 'localhost' in url or '127.0.0.1' in url:
    return "Acceso a localhost bloqueado"
`}
      </pre>
      <p>
        El filtro es insuficiente y permite bypasses sencillos.
      </p>
      <p>
        Sin embargo, no en todos los sistemas operativos funcionan las variantes de las direcciones IPs. Por ejemplo, en Windows, <code>127.1</code> no es lo mismo que <code> 127.0.0.1 </code>
        y <code>0x7f000001</code> no es lo mismo que <code> 127.0.0.1 </code>. Por lo tanto, si estás usando Windows, no podrás usar estas variantes.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        <strong>Nivel Difícil:</strong> El backend bloquea rangos privados y metadatos cloud, pero aún puedes intentar técnicas de evasión avanzadas.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if re.search(r'127\.|localhost|10\.|192\.168\.|169\.254\.169\.254', url):
    return "Acceso a IPs privadas/metadatos bloqueado"
`}
      </pre>
      <p>
        El filtro es mejor, pero no perfecto.
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        <strong>Nivel Imposible:</strong> El backend solo permite imágenes de Unsplash. Cualquier otro destino es bloqueado.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if not url.startswith('https://images.unsplash.com/'):
    return "Solo se permiten imágenes de Unsplash"
`}
      </pre>
      <p>
        Así se evita la vulnerabilidad SSRF.
      </p>
    </div>
  )
};

export { pistas, soluciones, explicacionNivel };
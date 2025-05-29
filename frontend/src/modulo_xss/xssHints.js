const pistas = {
  1: {
    facil: "Prueba a escribir algún script de HTML en el campo de búsqueda. Si ves una alerta, la aplicación es vulnerable a XSS reflejado.",
    medio: "El filtro elimina <script>, pero puedes probar con otras etiquetas. ¿Se ejecuta el código?",
    dificil: "El escape básico impide la ejecución de etiquetas, pero ¿puedes intentar algún vector avanzado como URLs javascript: o eventos poco comunes?",
    imposible: "No es posible ejecutar código JavaScript en este nivel. Todos los datos del usuario se muestran como texto plano."
  },
  2: {
    facil: "Deja un comentario con algún script de HTML. Si ves una alerta al recargar, es XSS almacenado.",
    medio: "El filtro elimina <script>, pero puedes probar con otras etiquetas con eventos.",
    dificil: "El escape básico impide la ejecución de etiquetas, pero ¿puedes intentar algún vector avanzado como SVG o atributos poco comunes?",
    imposible: "No es posible ejecutar código JavaScript en los comentarios en este nivel."
  }
};

const soluciones = {
  1: {
    facil: (
      <div>
        <ol>
          <li>En el campo de búsqueda, escribe: <code>{`<script>alert('XSS')</script>`}</code></li>
          <li>Pulsa Enter o Buscar.</li>
          <li>Si ves una alerta, la aplicación es vulnerable a XSS reflejado.</li>
        </ol>
      </div>
    ),
    medio: (
      <div>
        <ol>
          <li>En el campo de búsqueda, escribe: <code>{`<img src=x onerror=alert(1)>`}</code></li>
          <li>Pulsa Enter o Buscar.</li>
          <li>Si ves una alerta, la aplicación sigue siendo vulnerable a XSS reflejado.</li>
        </ol>
      </div>
    ),
    dificil: (
      <div>
        <ol>
          <li>El escape básico impide la ejecución de etiquetas HTML.</li>
          <li>Prueba vectores avanzados como <code>{`<svg/onload=alert(1)>`}</code> o URLs <code>javascript:</code>, pero deberían ser bloqueados.</li>
          <li>No deberías poder ejecutar código JavaScript.</li>
        </ol>
      </div>
    ),
    imposible: (
      <div>
        <p>No es posible ejecutar código JavaScript en este nivel. Todos los datos del usuario se muestran como texto plano.</p>
      </div>
    )
  },
  2: {
    facil: (
      <div>
        <ol>
          <li>Deja un comentario como: <code>{`<img src=x onerror=alert('XSS')>`}</code> o <code>{`<script>alert('XSS almacenado')</script>`}</code></li>
          <li>Recarga la página o revisa la lista de comentarios.</li>
          <li>Si ves una alerta, la aplicación es vulnerable a XSS almacenado.</li>
        </ol>
      </div>
    ),
    medio: (
      <div>
        <ol>
          <li>Deja un comentario como: <code>{`<img src=x onerror=alert(1)>`}</code></li>
          <li>Recarga la página o revisa la lista de comentarios.</li>
          <li>Si ves una alerta, la aplicación sigue siendo vulnerable a XSS almacenado.</li>
        </ol>
      </div>
    ),
    dificil: (
      <div>
        <ol>
          <li>El escape básico impide la ejecución de etiquetas HTML.</li>
          <li>Prueba vectores avanzados como <code>{`<svg/onload=alert(1)>`}</code>, pero deberían ser bloqueados.</li>
          <li>No deberías poder ejecutar código JavaScript.</li>
        </ol>
      </div>
    ),
    imposible: (
      <div>
        <p>No es posible ejecutar código JavaScript en los comentarios en este nivel.</p>
      </div>
    )
  }
};

const explicacionNivel = {
  facil: (
    <div>
      <p>
        <strong>Nivel Fácil:</strong> El frontend muestra los datos del usuario directamente en el HTML usando <code>dangerouslySetInnerHTML</code>, sin ningún tipo de filtrado ni escape. Esto permite ejecutar cualquier código JavaScript, como <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> o <code>&lt;img src=x onerror=alert(1)&gt;</code>.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`<div dangerouslySetInnerHTML={{ __html: valorUsuario }} />`}
      </pre>
      <p>
        Es el escenario más vulnerable y didáctico para practicar ataques XSS reflejado y almacenado.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        <strong>Nivel Medio:</strong> El frontend elimina solo las etiquetas <code>&lt;script&gt;</code>, pero permite otras etiquetas y atributos peligrosos como <code>onerror</code> en imágenes. Esto permite XSS usando vectores alternativos.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`valorUsuario.replace(/<\s*script.*?>.*?<\s*\/\s*script\s*>/gi, '')`}
      </pre>
      <p>
        Es más seguro que el nivel fácil, pero sigue siendo vulnerable a muchos vectores de XSS.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        <strong>Nivel Difícil:</strong> El frontend escapa los caracteres HTML básicos (&lt;, &gt;, ", ', &amp;), por lo que las etiquetas no se interpretan como HTML. Sin embargo, algunos vectores avanzados podrían funcionar si el escape no es completo.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`valorUsuario.replace(/[&<>"']/g, m => map[m])`}
      </pre>
      <p>
        La mayoría de los ataques XSS quedan bloqueados, pero aún podrían existir vectores muy avanzados si el escape no es perfecto.
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        <strong>Nivel Imposible:</strong> El frontend elimina todas las etiquetas HTML y muestra solo texto plano. No es posible ejecutar ningún código JavaScript, ni siquiera con vectores avanzados.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`valorUsuario.replace(/<[^>]*>?/gm, '')`}
      </pre>
      <p>
        Es el nivel más seguro y realista para una aplicación protegida contra XSS.
      </p>
    </div>
  )
};

export { pistas, soluciones, explicacionNivel };
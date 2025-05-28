const pistas = {
  1: {
    facil: "Recuerda que en los formularios de login vulnerables a SQLi, puedes intentar modificar el campo de usuario o contraseña para alterar la consulta SQL. Piensa en cómo podrías hacer que la condición del WHERE siempre sea verdadera.",
    medio: "No puedes usar comillas simples ni dobles. Intenta una inyección SQL sin comillas en el campo de usuario o contraseña.",
    dificil: "Las inyecciones clásicas no funcionan. Prueba técnicas avanzadas como blind SQLi o error-based SQLi si el backend muestra errores.",
    imposible: "No es posible explotar la vulnerabilidad en este nivel. Solo podrás acceder con credenciales válidas."
  },
  3: {
    facil: "El parámetro id en la URL se utiliza directamente en la consulta SQL. Intenta modificarlo en la barra de direcciones para ver si puedes acceder a otros productos o productos ocultos.",
    medio: "No puedes usar comillas. Prueba a modificar el parámetro id en la URL usando una inyección sin comillas.",
    dificil: "Las inyecciones clásicas no funcionan. Prueba técnicas avanzadas, como blind SQLi, si el backend muestra errores.",
    imposible: "No es posible explotar la vulnerabilidad en el parámetro id en este nivel."
  },
  2: {
    facil: "Los campos de búsqueda y categoría también se usan en consultas SQL. Intenta escribir algo inesperado para ver si puedes mostrar productos ocultos.",
    medio: "No puedes usar comillas. Prueba una inyección SQL sin comillas en el campo de búsqueda.",
    dificil: "Prueba técnicas avanzadas, como usar comentarios, funciones o subconsultas si el backend lo permite.",
    imposible: "No es posible mostrar productos ocultos mediante inyección SQL en este nivel."
  }
};

const soluciones = {
  1: {
    facil: (
      <div>
        <ol>
          <li>En el campo de usuario escribe: <code>admin' OR 1=1 --</code> (o en el campo de contraseña).</li>
          <li>Pulsa "Iniciar sesión".</li>
          <li>Accederás sin necesidad de conocer la contraseña.</li>
        </ol>
      </div>
    ),
    medio: (
      <div>
        <ol>
          <li>No puedes usar comillas simples ni dobles.</li>
          <li>Prueba con: <code>0 OR 1=1 --</code> o en el campo de usuario.</li>
          <li>Pulsa "Iniciar sesión".</li>
          <li>Si el backend lo permite, accederás sin contraseña.</li>
        </ol>
      </div>
    ),
    dificil: (
      <div>
        <ol>
          <li>Las inyecciones clásicas no funcionan.</li>
          <li>Prueba técnicas avanzadas como <strong>blind SQLi</strong>:</li>
          <li>
            Intenta con: <code>admin' AND 1=1 --</code> y observa si cambia el mensaje de error.
            Si el backend muestra errores, puedes intentar deducir información carácter a carácter.
          </li>
          <li>Si no hay mensajes de error, prueba con combinaciones y observa el comportamiento.</li>
        </ol>
      </div>
    ),
    imposible: (
      <div>
        <p>No es posible explotar la vulnerabilidad. Solo podrás acceder con credenciales válidas.</p>
      </div>
    )
  },
  
  2: {
    facil: (
      <div>
        <ol>
          <li>En el campo de búsqueda, escribe: <code>' OR 1=1 --</code></li>
          <li>Pulsa "Buscar".</li>
          <li>Deberías ver todos los productos, incluyendo los de la categoría "Oculta".</li>
        </ol>
      </div>
    ),
    medio: (
      <div>
        <ol>
          <li>No puedes usar comillas.</li>
          <li>Prueba con: <code>OR 1=1</code></li>
          <li>Pulsa "Buscar" y observa si aparecen productos ocultos.</li>
        </ol>
      </div>
    ),
    dificil: (
      <div>
        <ol>
          <li>Prueba técnicas avanzadas, como usar comentarios, funciones o subconsultas si el backend lo permite.</li>
          <li>Ejemplo: <code>a%' OR 1=1 --</code></li>
          <li>Observa si logras mostrar productos ocultos.</li>
        </ol>
      </div>
    ),
    imposible: (
      <div>
        <p>No es posible mostrar productos ocultos mediante inyección SQL.</p>
      </div>
    )
  },
  3: {
    facil: (
      <div>
        <ol>
          <li>Haz clic en cualquier producto para ir a la página de detalle.</li>
          <li>En la URL, cambia el parámetro <code>id</code> por: <code>1 OR 1=1</code></li>
          <li>Ejemplo: <code>/modulo/sql-inyeccion/tienda/producto?id=1 OR 1=1</code></li>
          <li>Pulsa Enter. Tras probar con diferentes IDs, ¡encontrarás un producto oculto!</li>
        </ol>
      </div>
    ),
    medio: (
      <div>
        <ol>
          <li>No puedes usar comillas.</li>
          <li>Prueba con: <code>1 OR 1=1</code> o <code>1 OR TRUE--</code></li>
          <li>Pulsa Enter tras modificar la URL. Tras probar con diferentes IDs, ¡encontrarás un producto oculto!</li>
        </ol>
      </div>
    ),
    dificil: (
      <div>
        <ol>
          <li>Las inyecciones clásicas no funcionan.</li>
          <li>Prueba con técnicas avanzadas, por ejemplo: <code>1 AND (SELECT SUBSTR(nombre,1,1) FROM productos WHERE id=1)='A'</code></li>
          <li>Observa si el comportamiento cambia o si puedes deducir información.</li>
        </ol>
      </div>
    ),
    imposible: (
      <div>
        <p>No es posible explotar la vulnerabilidad en el parámetro <code>id</code>.</p>
      </div>
    )
  }
};

const explicacionNivel = {
  facil: (
    <div>
      <p>
        <strong>Nivel Fácil:</strong> El backend construye las consultas SQL directamente con los datos del usuario, sin ningún tipo de validación ni filtrado. 
        Esto significa que puedes usar comillas, operadores lógicos y cualquier payload clásico de inyección SQL. 
        Es el escenario más vulnerable y didáctico para practicar ataques básicos.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`query = f"SELECT * FROM usuarios WHERE nombre = '{username}' AND email = '{password}'"
cursor.execute(query)
`}
      </pre>
      <p>
        Puedes romper la consulta fácilmente y acceder como cualquier usuario, o mostrar todos los productos, incluidos los ocultos, con inyecciones clásicas como <code>' OR 1=1 --</code>.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        <strong>Nivel Medio:</strong> El backend filtra comillas simples y dobles, por lo que no puedes usar inyecciones clásicas que requieran cerrar cadenas. 
        Sin embargo, <b>no utiliza consultas preparadas</b> y sigue insertando directamente los datos del usuario en la consulta SQL, pero sin comillas alrededor del valor.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if "'" in username or '"' in username:
    return error
query = f"SELECT * FROM usuarios WHERE nombre = {username} AND email = {password}"
cursor.execute(query)
`}
      </pre>
      <p>
        Esto permite inyecciones SQL <b>sin comillas</b>, por ejemplo usando valores numéricos o expresiones lógicas (<code>0 OR 1=1 --</code>). 
        Es más difícil que el nivel fácil, pero sigue siendo vulnerable.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        <strong>Nivel Difícil:</strong> El backend utiliza <b>consultas preparadas (parametrizadas)</b>, lo que impide la inyección SQL clásica. 
        Sin embargo, si ocurre un error SQL, el backend muestra el mensaje de error en la respuesta. 
        Esto puede permitir ataques avanzados como <b>error-based SQLi</b> o <b>blind SQLi</b> si el atacante es creativo y el backend expone información sensible.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`query = "SELECT * FROM usuarios WHERE nombre = ? AND email = ?"
cursor.execute(query, (username, password))
`}
      </pre>
      <p>
        La inyección clásica no funciona, pero podrías intentar técnicas avanzadas si el backend muestra errores detallados.
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        <strong>Nivel Imposible:</strong> El backend utiliza <b>consultas preparadas</b> y además <b>no muestra mensajes de error SQL</b> al usuario. 
        Esto elimina prácticamente cualquier vector de inyección SQL, incluso los más avanzados, y no expone información interna del sistema.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`query = "SELECT * FROM usuarios WHERE nombre = ? AND email = ?"
cursor.execute(query, (username, password))
`}
      </pre>
      <p>
        No es posible explotar la inyección SQL en este nivel. Solo puedes acceder con credenciales válidas y no obtendrás información extra aunque provoques errores.
      </p>
    </div>
  )
};

export { pistas, soluciones, explicacionNivel };
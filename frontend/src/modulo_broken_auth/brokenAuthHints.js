const pistas = {
  facil: (
    <div>
      <p>
        Prueba a introducir un usuario que no exista y observa el mensaje de error. Luego prueba con un usuario válido y una contraseña incorrecta.
        ¿Notas la diferencia? Intenta también hacer muchos intentos de login seguidos.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        Los mensajes de error son genéricos, pero puedes probar fuerza bruta: intenta muchas contraseñas para un usuario conocido.
        Observa si hay algún tipo de bloqueo o retraso.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        Hay límite de intentos, pero no hay captcha. Intenta varios intentos rápidos y observa si te bloquean temporalmente.
        ¿Puedes saltarte el límite de alguna forma?
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        El sistema está protegido: mensajes de error genéricos, límite de intentos y captcha. No deberías poder explotar la autenticación.
      </p>
    </div>
  )
};

const soluciones = {
  facil: (
    <ol>
      <li>Introduce un usuario que no exista, por ejemplo <code>noexiste</code>. Verás un mensaje como "Usuario no encontrado".</li>
      <li>Introduce un usuario válido (<code>admin</code>) y una contraseña incorrecta. Verás "Contraseña incorrecta".</li>
      <li>Esto permite a un atacante enumerar usuarios válidos.</li>
      <li>Además, puedes probar muchas contraseñas seguidas sin ser bloqueado (fuerza bruta).</li>
    </ol>
  ),
  medio: (
    <ol>
      <li>Introduce cualquier usuario y contraseña incorrectos. El mensaje será siempre el mismo, pero puedes probar muchas combinaciones rápidamente.</li>
      <li>Haz fuerza bruta sobre un usuario conocido (por ejemplo, <code>admin</code>), probando contraseñas comunes.</li>
      <li>Como no hay límite de intentos, puedes descubrir la contraseña si es débil.</li>
    </ol>
  ),
  dificil: (
    <ol>
      <li>Haz varios intentos de login fallidos rápidamente. Tras cierto número, el sistema te bloqueará temporalmente.</li>
      <li>Intenta saltarte el límite cambiando de IP o usando otro navegador.</li>
      <li>Si no puedes, el sistema está parcialmente protegido, pero aún no hay captcha.</li>
    </ol>
  ),
  imposible: (
    <ol>
      <li>Los mensajes de error son siempre genéricos.</li>
      <li>Hay límite de intentos y captcha tras varios fallos.</li>
      <li>No puedes explotar la autenticación ni por enumeración ni por fuerza bruta.</li>
    </ol>
  )
};

const explicacionNivel = {
  facil: (
    <div>
      <p>
        <strong>Nivel Fácil:</strong> El backend muestra mensajes de error distintos para usuario inexistente y contraseña incorrecta, y no hay límite de intentos.
        Esto permite enumerar usuarios y hacer fuerza bruta.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if not usuario_existe(username):
    return "Usuario no encontrado"
if not password_correcta(username, password):
    return "Contraseña incorrecta"
# Sin límite de intentos`}
      </pre>
      <p>
        Un atacante puede descubrir usuarios válidos y probar muchas contraseñas sin restricción.
      </p>
    </div>
  ),
  medio: (
    <div>
      <p>
        <strong>Nivel Medio:</strong> El backend muestra siempre el mismo mensaje de error, pero no hay límite de intentos.
        Esto evita la enumeración de usuarios, pero permite fuerza bruta.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if not usuario_existe(username) or not password_correcta(username, password):
    return "Usuario o contraseña incorrectos"
# Sin límite de intentos`}
      </pre>
      <p>
        Un atacante no puede saber si el usuario existe, pero puede probar muchas contraseñas para un usuario conocido.
      </p>
    </div>
  ),
  dificil: (
    <div>
      <p>
        <strong>Nivel Difícil:</strong> El backend muestra mensajes genéricos y limita el número de intentos de login.
        Tras varios fallos, bloquea temporalmente el acceso.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if intentos_fallidos > 5:
    bloquear_usuario_temporalmente(username)
    return "Demasiados intentos, inténtalo más tarde"
if not usuario_existe(username) or not password_correcta(username, password):
    return "Usuario o contraseña incorrectos"`}
      </pre>
      <p>
        Esto dificulta la fuerza bruta, pero aún no hay captcha.
      </p>
    </div>
  ),
  imposible: (
    <div>
      <p>
        <strong>Nivel Imposible:</strong> El backend muestra mensajes genéricos, limita los intentos y añade captcha tras varios fallos.
        Además, exige contraseñas fuertes.
      </p>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`if intentos_fallidos > 5:
    mostrar_captcha()
    return "Demasiados intentos, resuelve el captcha"
if not usuario_existe(username) or not password_correcta(username, password):
    return "Usuario o contraseña incorrectos"
# Contraseñas fuertes obligatorias`}
      </pre>
      <p>
        Así se evita la explotación de la autenticación rota.
      </p>
    </div>
  )
};

export { pistas, soluciones, explicacionNivel };
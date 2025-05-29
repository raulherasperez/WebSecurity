const brokenAuthQuestions = [
  {
    question: "¿Qué es Broken Authentication?",
    options: [
      "Un error de sintaxis en el código.",
      "Un tipo de ataque XSS.",
      "Un fallo en la autenticación que permite a un atacante acceder a cuentas ajenas o realizar acciones como otro usuario.",
      "Un fallo en la base de datos."
    ],
    correctAnswer: "Un fallo en la autenticación que permite a un atacante acceder a cuentas ajenas o realizar acciones como otro usuario."
  },
  {
    question: "¿Cuál de los siguientes es un síntoma de Broken Authentication?",
    options: [
      "Uso de captcha en el login.",
      "Bloqueo tras varios intentos fallidos.",
      "Mensajes de error distintos para usuario inexistente y contraseña incorrecta.",
      "Uso de contraseñas fuertes obligatorias."
    ],
    correctAnswer: "Mensajes de error distintos para usuario inexistente y contraseña incorrecta."
  },
  {
    question: "¿Qué técnica puede explotar un atacante si no hay límite de intentos de login?",
    options: [
      "CSRF.",
      "Fuerza bruta.",
      "SQL Injection.",
      "Open Redirect."
    ],
    correctAnswer: "Fuerza bruta."
  },
  {
    question: "¿Cómo se puede evitar la enumeración de usuarios en el login?",
    options: [
      "No usando HTTPS.",
      "Permitiendo contraseñas débiles.",
      "Mostrando siempre el mismo mensaje de error.",
      "No validando los datos del usuario."
    ],
    correctAnswer: "Mostrando siempre el mismo mensaje de error."
  },
  {
    question: "¿Qué medida NO ayuda a prevenir Broken Authentication?",
    options: [
      "Forzar contraseñas fuertes.",
      "Bloquear tras varios intentos fallidos.",
      "Usar mensajes de error genéricos.",
      "Permitir intentos ilimitados de login."
    ],
    correctAnswer: "Permitir intentos ilimitados de login."
  },
  {
    question: "¿Por qué es peligroso permitir contraseñas débiles en una aplicación?",
    options: [
      "Hace que la aplicación sea más rápida.",
      "Facilita ataques de fuerza bruta y acceso no autorizado.",
      "Permite a los usuarios recordar mejor sus contraseñas.",
      "No tiene ningún impacto en la seguridad."
    ],
    correctAnswer: "Facilita ataques de fuerza bruta y acceso no autorizado."
  },
  {
    question: "¿Qué es un ataque de sesión fijada (session fixation)?",
    options: [
      "Cuando la sesión expira automáticamente.",
      "Cuando se usa HTTPS para la autenticación.",
      "Cuando un atacante fuerza a la víctima a usar un identificador de sesión conocido por el atacante.",
      "Cuando un usuario olvida cerrar sesión."
    ],
    correctAnswer: "Cuando un atacante fuerza a la víctima a usar un identificador de sesión conocido por el atacante."
  },
  {
    question: "¿Cuál de los siguientes es un ejemplo de mala práctica en la gestión de sesiones?",
    options: [
      "Regenerar el identificador de sesión tras el login.",
      "No invalidar la sesión tras cerrar sesión.",
      "Usar cookies con el atributo HttpOnly.",
      "Establecer un tiempo de expiración corto para las sesiones."
    ],
    correctAnswer: "No invalidar la sesión tras cerrar sesión."
  },
  {
    question: "¿Qué es el credential stuffing?",
    options: [
      "Un ataque de denegación de servicio.",
      "Un tipo de XSS.",
      "Un método de cifrado de contraseñas.",
      "El uso de combinaciones de usuario/contraseña filtradas en otros servicios para intentar acceder a cuentas."
    ],
    correctAnswer: "El uso de combinaciones de usuario/contraseña filtradas en otros servicios para intentar acceder a cuentas."
  },
  {
    question: "¿Qué atributo de cookie ayuda a proteger la sesión frente a ataques XSS?",
    options: [
      "Path.",
      "HttpOnly.",
      "Domain.",
      "Expires."
    ],
    correctAnswer: "HttpOnly."
  }
];

export default brokenAuthQuestions;
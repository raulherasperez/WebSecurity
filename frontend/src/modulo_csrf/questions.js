const csrfQuestions = [
  {
    question: "¿Qué es un ataque CSRF y cómo funciona?",
    options: [
      "Un ataque que fuerza a un usuario autenticado a ejecutar acciones no deseadas en una aplicación web, aprovechando que el navegador envía automáticamente las cookies de sesión.",
      "Un ataque que roba cookies mediante JavaScript.",
      "Un ataque que explota errores de validación de formularios.",
      "Un ataque que explota la inyección SQL."
    ],
    correctAnswer: "Un ataque que fuerza a un usuario autenticado a ejecutar acciones no deseadas en una aplicación web, aprovechando que el navegador envía automáticamente las cookies de sesión."
  },
  {
    question: "¿Cuál de las siguientes medidas ayuda a prevenir CSRF?",
    options: [
      "Validar el origen de la petición y usar tokens CSRF únicos por usuario.",
      "Usar solo HTTPS.",
      "Validar el tamaño de los formularios.",
      "Limitar el tamaño de las cookies."
    ],
    correctAnswer: "Validar el origen de la petición y usar tokens CSRF únicos por usuario."
  },
  {
    question: "¿Por qué las cookies de sesión permiten ataques CSRF?",
    options: [
      "Porque se envían automáticamente con cada petición al dominio, sin importar el origen.",
      "Porque son visibles en JavaScript.",
      "Porque no están cifradas.",
      "Porque expiran rápidamente."
    ],
    correctAnswer: "Porque se envían automáticamente con cada petición al dominio, sin importar el origen."
  },
  {
    question: "¿Cuál de los siguientes ejemplos representa un ataque CSRF?",
    options: [
      "Una página externa que envía un formulario POST a una aplicación donde el usuario está autenticado.",
      "Un usuario que introduce un script en un campo de texto.",
      "Un atacante que intercepta tráfico de red.",
      "Un usuario que olvida cerrar sesión."
    ],
    correctAnswer: "Una página externa que envía un formulario POST a una aplicación donde el usuario está autenticado."
  },
  {
    question: "¿Qué es un token CSRF?",
    options: [
      "Un valor único y aleatorio que la aplicación genera y asocia a la sesión del usuario, y que debe enviarse con cada petición sensible para verificar su legitimidad.",
      "Un tipo de cookie especial.",
      "Un encabezado HTTP estándar.",
      "Un tipo de contraseña temporal."
    ],
    correctAnswer: "Un valor único y aleatorio que la aplicación genera y asocia a la sesión del usuario, y que debe enviarse con cada petición sensible para verificar su legitimidad."
  },
  {
    question: "¿Qué otras medidas pueden ayudar a mitigar CSRF además de los tokens?",
    options: [
      "Configurar las cookies de sesión como SameSite y validar los encabezados Origin/Referer.",
      "Permitir cualquier origen en CORS.",
      "Desactivar HTTPS.",
      "Permitir peticiones GET para acciones sensibles."
    ],
    correctAnswer: "Configurar las cookies de sesión como SameSite y validar los encabezados Origin/Referer."
  }
];

export default csrfQuestions;
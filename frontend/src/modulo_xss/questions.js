const xssQuestions = [
  {
    question: "¿Qué es un ataque XSS?",
    options: [
      "Un ataque que explota vulnerabilidades de inyección de código JavaScript en páginas web",
      "Un ataque que explota contraseñas débiles",
      "Un ataque que explota configuraciones inseguras del servidor",
      "Un ataque que explota la inyección SQL"
    ],
    correctAnswer: "Un ataque que explota vulnerabilidades de inyección de código JavaScript en páginas web"
  },
  {
    question: "¿Cuál de los siguientes NO es un tipo de XSS?",
    options: [
      "Reflejado",
      "Almacenado",
      "DOM-based",
      "Inyección SQL"
    ],
    correctAnswer: "Inyección SQL"
  },
  {
    question: "¿Qué puede lograr un atacante con un XSS exitoso?",
    options: [
      "Robar cookies de sesión",
      "Modificar el contenido de la página",
      "Redirigir al usuario a sitios maliciosos",
      "Todas las anteriores"
    ],
    correctAnswer: "Todas las anteriores"
  },
  {
    question: "¿Cuál es una buena práctica para prevenir XSS?",
    options: [
      "Validar y escapar las entradas del usuario",
      "Permitir cualquier entrada sin validación",
      "Desactivar el firewall",
      "Usar solo contraseñas fuertes"
    ],
    correctAnswer: "Validar y escapar las entradas del usuario"
  },
  {
    question: "¿Qué función cumple Content Security Policy (CSP)?",
    options: [
      "Limita los recursos que puede cargar una página web",
      "Permite la ejecución de cualquier script",
      "Desactiva la validación de formularios",
      "Permite la inyección de código"
    ],
    correctAnswer: "Limita los recursos que puede cargar una página web"
  }
];

export default xssQuestions;
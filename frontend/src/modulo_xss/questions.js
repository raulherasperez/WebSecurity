const xssQuestions = [
  {
    question: "¿Qué es un ataque XSS y por qué es peligroso?",
    options: [
      "Un ataque que explota vulnerabilidades de inyección de código JavaScript en páginas web, permitiendo a un atacante ejecutar scripts maliciosos en el navegador de otros usuarios.",
      "Un ataque que explota contraseñas débiles.",
      "Un ataque que explota configuraciones inseguras del servidor.",
      "Un ataque que explota la inyección SQL."
    ],
    correctAnswer: "Un ataque que explota vulnerabilidades de inyección de código JavaScript en páginas web, permitiendo a un atacante ejecutar scripts maliciosos en el navegador de otros usuarios."
  },
  {
    question: "¿Cuáles son los principales tipos de XSS?",
    options: [
      "Reflejado, almacenado y basado en DOM.",
      "SQLi, CSRF y SSRF.",
      "Reflejado, CSRF y RCE.",
      "Almacenado, SSRF y XXE."
    ],
    correctAnswer: "Reflejado, almacenado y basado en DOM."
  },
  {
    question: "¿Qué puede lograr un atacante con un XSS exitoso?",
    options: [
      "Robar cookies de sesión y credenciales.",
      "Modificar el contenido de la página o redirigir al usuario.",
      "Capturar pulsaciones de teclado o propagar malware.",
      "Todas las anteriores."
    ],
    correctAnswer: "Todas las anteriores."
  },
  {
    question: "¿Cuál es una buena práctica para prevenir XSS?",
    options: [
      "Validar y escapar las entradas del usuario y nunca insertar datos no confiables en el HTML sin sanitizar.",
      "Permitir cualquier entrada sin validación.",
      "Desactivar el firewall.",
      "Usar solo contraseñas fuertes."
    ],
    correctAnswer: "Validar y escapar las entradas del usuario y nunca insertar datos no confiables en el HTML sin sanitizar."
  },
  {
    question: "¿Qué función cumple Content Security Policy (CSP) en la protección contra XSS?",
    options: [
      "Limita los recursos y scripts que puede cargar y ejecutar una página web, ayudando a mitigar el impacto de XSS.",
      "Permite la ejecución de cualquier script.",
      "Desactiva la validación de formularios.",
      "Permite la inyección de código."
    ],
    correctAnswer: "Limita los recursos y scripts que puede cargar y ejecutar una página web, ayudando a mitigar el impacto de XSS."
  },
  {
    question: "¿Por qué es peligroso usar innerHTML o dangerouslySetInnerHTML?",
    options: [
      "Porque permite insertar código HTML y JavaScript directamente en el DOM, lo que puede ser explotado por un atacante si los datos no están correctamente sanitizados.",
      "Porque hace la página más lenta.",
      "Porque bloquea el acceso a la base de datos.",
      "Porque desactiva el CSS."
    ],
    correctAnswer: "Porque permite insertar código HTML y JavaScript directamente en el DOM, lo que puede ser explotado por un atacante si los datos no están correctamente sanitizados."
  }
];

export default xssQuestions;
const ssrfQuestions = [
  {
    question: "¿Qué es una vulnerabilidad SSRF?",
    options: [
      "Una vulnerabilidad que permite a un atacante forzar al servidor a realizar peticiones a recursos internos o externos controlando la URL o destino.",
      "Un ataque que explota la inyección SQL.",
      "Un ataque que permite ejecutar código JavaScript en el navegador.",
      "Un ataque que explota la falta de autenticación."
    ],
    correctAnswer: "Una vulnerabilidad que permite a un atacante forzar al servidor a realizar peticiones a recursos internos o externos controlando la URL o destino."
  },
  {
    question: "¿Cuál de los siguientes es un ejemplo de SSRF?",
    options: [
      "Una aplicación que permite a los usuarios obtener una vista previa de una imagen descargando la URL proporcionada sin validación.",
      "Un formulario de login vulnerable a fuerza bruta.",
      "Un campo de búsqueda vulnerable a XSS.",
      "Un endpoint que permite subir archivos."
    ],
    correctAnswer: "Una aplicación que permite a los usuarios obtener una vista previa de una imagen descargando la URL proporcionada sin validación."
  },
  {
    question: "¿Qué riesgos puede implicar una vulnerabilidad SSRF?",
    options: [
      "Acceso a recursos internos, escaneo de red, obtención de metadatos en la nube y bypass de controles de acceso.",
      "Solo acceso a archivos públicos.",
      "Solo ejecución de código en el navegador.",
      "Solo denegación de servicio."
    ],
    correctAnswer: "Acceso a recursos internos, escaneo de red, obtención de metadatos en la nube y bypass de controles de acceso."
  },
  {
    question: "¿Cómo se puede prevenir SSRF?",
    options: [
      "Validando y restringiendo las URLs permitidas, usando listas blancas de dominios y evitando el acceso a direcciones internas.",
      "Permitiendo cualquier URL proporcionada por el usuario.",
      "Solo usando HTTPS.",
      "Desactivando los logs del servidor."
    ],
    correctAnswer: "Validando y restringiendo las URLs permitidas, usando listas blancas de dominios y evitando el acceso a direcciones internas."
  },
  {
    question: "¿Por qué es peligroso permitir que el backend acceda a direcciones como 127.0.0.1 o 169.254.169.254?",
    options: [
      "Porque pueden exponer servicios internos o credenciales sensibles de la infraestructura.",
      "Porque ralentiza la aplicación.",
      "Porque bloquea el acceso a Internet.",
      "Porque genera errores de JavaScript."
    ],
    correctAnswer: "Porque pueden exponer servicios internos o credenciales sensibles de la infraestructura."
  },
  {
    question: "¿Qué es una lista blanca (whitelist) en el contexto de SSRF?",
    options: [
      "Una lista de dominios o direcciones permitidas a las que el backend puede acceder.",
      "Una lista de usuarios administradores.",
      "Una lista de contraseñas seguras.",
      "Una lista de endpoints públicos."
    ],
    correctAnswer: "Una lista de dominios o direcciones permitidas a las que el backend puede acceder."
  }
];

export default ssrfQuestions;
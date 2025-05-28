const bacQuestions = [
  {
    question: "¿Qué es Broken Access Control?",
    options: [
      "Permitir a usuarios no autenticados acceder a recursos restringidos.",
      "Permitir a usuarios autenticados realizar acciones o acceder a recursos para los que no tienen permiso.",
      "Permitir a usuarios cambiar su propia contraseña.",
      "Permitir a usuarios ver su propio perfil."
    ],
    correctAnswer: "Permitir a usuarios autenticados realizar acciones o acceder a recursos para los que no tienen permiso."
  },
  {
    question: "¿Cuál de los siguientes es un ejemplo de Broken Access Control?",
    options: [
      "Un usuario puede ver su propio perfil.",
      "Un usuario puede acceder al perfil de otro usuario cambiando el parámetro en la URL.",
      "Un usuario puede cerrar sesión.",
      "Un usuario puede actualizar su correo electrónico."
    ],
    correctAnswer: "Un usuario puede acceder al perfil de otro usuario cambiando el parámetro en la URL."
  },
  {
    question: "¿Cómo se puede prevenir Broken Access Control?",
    options: [
      "Validando siempre en el backend que el usuario autenticado tiene permiso para acceder o modificar el recurso solicitado.",
      "Solo usando autenticación en el frontend.",
      "Mostrando mensajes de error genéricos.",
      "Utilizando HTTPS."
    ],
    correctAnswer: "Validando siempre en el backend que el usuario autenticado tiene permiso para acceder o modificar el recurso solicitado."
  },
  {
    question: "¿Qué puede causar la falta de control de acceso?",
    options: [
      "Exposición de datos sensibles de otros usuarios.",
      "Ejecución de código malicioso en el navegador.",
      "Fuga de contraseñas por correo electrónico.",
      "Desbordamiento de búfer."
    ],
    correctAnswer: "Exposición de datos sensibles de otros usuarios."
  },
  {
    question: "¿Qué tipo de controles deben implementarse para evitar BAC?",
    options: [
      "Controles de acceso en el backend, comprobando siempre la identidad y permisos del usuario.",
      "Solo controles en el frontend.",
      "Permitir que el usuario envíe su propio ID en cada petición.",
      "No mostrar mensajes de error detallados."
    ],
    correctAnswer: "Controles de acceso en el backend, comprobando siempre la identidad y permisos del usuario."
  },
  {
    question: "¿Por qué no es suficiente confiar en el frontend para controlar el acceso?",
    options: [
      "Porque el frontend puede ser manipulado por el usuario y no es una barrera de seguridad real.",
      "Porque el frontend es más rápido.",
      "Porque el backend no puede validar nada.",
      "Porque el frontend siempre es seguro."
    ],
    correctAnswer: "Porque el frontend puede ser manipulado por el usuario y no es una barrera de seguridad real."
  }
];

export default bacQuestions;
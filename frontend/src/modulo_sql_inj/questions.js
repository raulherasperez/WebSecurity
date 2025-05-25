const sqlQuestions = [
  {
    question: "¿Qué es una inyección SQL?",
    options: [
      "Un ataque que modifica el diseño de una página web",
      "Una técnica para robar contraseñas mediante phishing",
      "Un método donde se inyecta código SQL malicioso en consultas de base de datos",
      "Un error de sintaxis en una consulta SQL"
    ],
    correctAnswer: "Un método donde se inyecta código SQL malicioso en consultas de base de datos"
  },
  {
    question: "¿Cuál de estos NO es un método efectivo para prevenir la inyección SQL?",
    options: [
      "Usar consultas preparadas (prepared statements)",
      "Validar las entradas del usuario",
      "Concatenar directamente cadenas en las consultas SQL",
      "Utilizar ORM como Sequelize o TypeORM"
    ],
    correctAnswer: "Concatenar directamente cadenas en las consultas SQL"
  },
  {
    question: "¿Qué hace '--' en una consulta SQL?",
    options: [
      "Activa una extensión del motor de base de datos",
      "Comienza un comentario que ignora el resto de la línea",
      "Indica una transacción segura",
      "Ejecuta una subconsulta"
    ],
    correctAnswer: "Comienza un comentario que ignora el resto de la línea"
  },
  {
    question: "¿Cuál de los siguientes es un ejemplo de entrada maliciosa para explotar una inyección SQL en un campo de usuario?",
    options: [
      "admin' OR 1=1 --",
      "SELECT * FROM usuarios",
      "DROP TABLE usuarios;",
      "user@example.com"
    ],
    correctAnswer: "admin' OR 1=1 --"
  },
  {
    question: "¿Qué tipo de daño puede causar una inyección SQL exitosa?",
    options: [
      "Solo mostrar mensajes de error",
      "Modificar, borrar o robar datos de la base de datos",
      "Cambiar el color de la página",
      "Desactivar el servidor web"
    ],
    correctAnswer: "Modificar, borrar o robar datos de la base de datos"
  },
  {
    question: "¿Qué función cumple la validación de entradas del usuario en la prevención de inyección SQL?",
    options: [
      "Evita que los usuarios escriban en mayúsculas",
      "Limita el tipo y formato de datos que se pueden enviar",
      "Aumenta la velocidad de la base de datos",
      "Permite consultas más complejas"
    ],
    correctAnswer: "Limita el tipo y formato de datos que se pueden enviar"
  },
  {
    question: "¿Qué es una consulta preparada (prepared statement)?",
    options: [
      "Una consulta SQL que se construye concatenando cadenas",
      "Una consulta SQL que separa los datos de la lógica de la consulta",
      "Un script que se ejecuta antes de iniciar la base de datos",
      "Un tipo de base de datos relacional"
    ],
    correctAnswer: "Una consulta SQL que separa los datos de la lógica de la consulta"
  },
  {
    question: "¿Qué puede indicar la aparición de errores de sintaxis SQL en una aplicación web?",
    options: [
      "Que la aplicación es segura",
      "Que la base de datos está actualizada",
      "Que puede existir una vulnerabilidad de inyección SQL",
      "Que el usuario ha escrito mal su contraseña"
    ],
    correctAnswer: "Que puede existir una vulnerabilidad de inyección SQL"
  }
];

export default sqlQuestions;
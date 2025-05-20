// questions.js
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
  }
];

export default sqlQuestions;
import React, { useState } from 'react';
import './css/InteractiveTest.css'; // Estilos externos

const InteractiveTest = ({ questions }) => {
  const [showTest, setShowTest] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(-1); // -1 significa que no se ha realizado aún

  const calculateScore = () => {
    let total = 0;
    questions.forEach((q, i) => {
      if (q.correctAnswer === selectedAnswers[i]) {
        total++;
      }
    });
    setScore(total);
  };

  const getFinalMessage = (score) => {
    if (score === questions.length) {
      return "🎉 ¡Excelente! Has entendido muy bien el tema.";
    } else if (score >= questions.length / 2) {
      return "👍 Buen trabajo, pero repasa lo que fallaste.";
    } else {
      return "📚 Sigue estudiando. ¡Tú puedes!";
    }
  };

  return (
    <div className="interactive-test-wrapper">
      {/* Botón para desplegar */}
      <button onClick={() => setShowTest(!showTest)}>
        {showTest ? 'Ocultar test' : 'Mostrar test'}
      </button>

      {/* Contenido del test (condicional) */}
      {showTest && (
        <div className="interactive-test">
          {questions.map((q, index) => (
            <div key={index} className="question-block">
              <p><strong>{q.question}</strong></p>
              <ul>
                {q.options.map((option, i) => (
                  <li key={i}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={() => {
                          const newAnswers = [...selectedAnswers];
                          newAnswers[index] = option;
                          setSelectedAnswers(newAnswers);
                        }}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
              {selectedAnswers[index] !== undefined && (
                <p className={q.correctAnswer === selectedAnswers[index] ? 'correct' : 'incorrect'}>
                  {q.correctAnswer === selectedAnswers[index]
                    ? '✅ ¡Correcto!'
                    : `❌ Incorrecto. La respuesta correcta es: ${q.correctAnswer}`}
                </p>
              )}
            </div>
          ))}

          {/* Botón para enviar */}
          <button onClick={calculateScore} className="submit-test-button">
            Ver resultados
          </button>

          {/* Resultados finales */}
          {score > -1 && (
            <div className="test-result">
              <h3>Tu puntuación: {score} de {questions.length}</h3>
              <p>{getFinalMessage(score)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveTest;
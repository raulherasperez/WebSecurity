import React, { useState } from 'react';
import { desbloquearLogro } from '../services/logroService';
import ModalLogroDesbloqueado from '../components/ModalLogroDesbloqueado';
import './css/CodeQuiz.css';

// Función para mezclar un array y devolver los primeros n elementos
function getRandomQuestions(questions, n) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const CodeQuiz = ({ questions }) => {
  // Si hay menos de 5 preguntas, usa todas
  const [quizSet, setQuizSet] = useState(() => getRandomQuestions(questions, Math.min(5, questions.length)));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [logroDesbloqueado, setLogroDesbloqueado] = useState(null);

  // Solo desbloquear el logro la primera vez
  const [quizCompletado, setQuizCompletado] = useState(
    localStorage.getItem('codeQuizCompletado') === 'true'
  );

  // Adaptar la estructura recibida del backend
  const quiz = quizSet[current];

  const handleSelect = idx => {
    setSelected(idx);
    setShowResult(true);
  };

  const nextQuiz = async () => {
    setSelected(null);
    setShowResult(false);
    if (current + 1 < quizSet.length) {
      setCurrent(c => c + 1);
    } else {
      setCompleted(true);

      // Desbloquear logro solo la primera vez
      if (!quizCompletado) {
        setQuizCompletado(true);
        localStorage.setItem('codeQuizCompletado', 'true');
        try {
          const token = localStorage.getItem('authToken');
          const resLogro = await desbloquearLogro(token, "Identificador novato");
          if (resLogro) {
            setLogroDesbloqueado(resLogro);
          }
        } catch {}
      }
    }
  };

  const reshuffle = () => {
    setQuizSet(getRandomQuestions(questions, Math.min(5, questions.length)));
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCompleted(false);
  };

  if (!quizSet.length) {
    return <div>No hay preguntas de código disponibles.</div>;
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <div style={{ fontWeight: 600, color: '#388e3c', marginBottom: 16 }}>
          ¡Has completado los {quizSet.length} ejemplos!
        </div>
        <button className="sandbox-btn" onClick={reshuffle}>
          Remezclar preguntas y volver a empezar
        </button>
        {logroDesbloqueado && (
          <ModalLogroDesbloqueado
            logro={logroDesbloqueado}
            onClose={() => setLogroDesbloqueado(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h4>{quiz.titulo}</h4>
      <pre className="sandbox-codequiz-block">
        {quiz.codigo.map((line, idx) => (
          <div
            key={idx}
            className={`sandbox-codequiz-line ${selected === idx ? 'selected' : ''} ${showResult && quiz.vulnerableLine === idx ? 'vulnerable' : ''}`}
            onClick={() => !showResult && handleSelect(idx)}
            style={{
              cursor: showResult ? 'default' : 'pointer',
              background: selected === idx ? '#e3eaf6' : (showResult && quiz.vulnerableLine === idx ? '#ffe0e0' : 'transparent')
            }}
          >
            <span style={{ color: '#888', marginRight: 8 }}>{idx + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
      {showResult && (
        <div style={{ marginTop: 16 }}>
          {selected === quiz.vulnerableLine ? (
            <div style={{ color: '#388e3c', fontWeight: 600 }}>¡Correcto!<br />{quiz.explicacion}</div>
          ) : (
            <div style={{ color: '#e53935', fontWeight: 600 }}>Incorrecto.<br />{quiz.explicacion}</div>
          )}
          <button className="sandbox-btn" style={{ marginTop: 12 }} onClick={nextQuiz}>
            {current + 1 < quizSet.length ? 'Siguiente ejemplo' : 'Finalizar'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 12, color: '#888', fontSize: '0.97em' }}>
        Pregunta {current + 1} de {quizSet.length}
      </div>
      {logroDesbloqueado && (
        <ModalLogroDesbloqueado
          logro={logroDesbloqueado}
          onClose={() => setLogroDesbloqueado(null)}
        />
      )}
    </div>
  );
};

export default CodeQuiz;
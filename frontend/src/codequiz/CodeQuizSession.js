import React, { useState } from 'react';
import CODE_QUIZ from './quizData';
import './css/CodeQuiz.css';

const MODULES = [
  { type: 'sqli', label: 'Inyección SQL' },
  { type: 'xss', label: 'XSS' },
  { type: 'csrf', label: 'CSRF' },
  // Añade más módulos si tienes más tipos en quizData.js
];

function shuffle(array) {
  // Fisher-Yates shuffle
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const CodeQuizSession = () => {
  const [step, setStep] = useState(0); // 0: config, 1: quiz, 2: result
  const [selectedModules, setSelectedModules] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);

  // Configuración inicial
  const handleStart = () => {
    let filtered = CODE_QUIZ.filter(q => selectedModules.includes(q.type));
    let shuffled = shuffle(filtered).slice(0, numQuestions);
    setQuestions(shuffled);
    setStep(1);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCorrect(0);
  };

  // Selección de módulo
  const handleModuleChange = (type) => {
    setSelectedModules(mods =>
      mods.includes(type) ? mods.filter(m => m !== type) : [...mods, type]
    );
  };

  // Selección de respuesta
  const handleSelect = idx => {
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[current].vulnerableLine) {
      setCorrect(c => c + 1);
    }
  };

  // Siguiente pregunta o resultado final
  const nextQuiz = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setStep(2);
    }
  };

  // Reiniciar sesión
  const handleRestart = () => {
    setStep(0);
    setSelectedModules([]);
    setNumQuestions(5);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCorrect(0);
  };

  // Pantalla de configuración
  if (step === 0) {
    return (
      <div className="sandbox-product-detail-page">
        <h2>Sesión de retos de código</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleStart();
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 340 }}
        >
          <div>
            <strong>¿Sobre qué módulos quieres preguntas?</strong>
            <div style={{ marginTop: 8 }}>
              {MODULES.map(mod => (
                <label key={mod.type} style={{ marginRight: 16 }}>
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(mod.type)}
                    onChange={() => handleModuleChange(mod.type)}
                  />{' '}
                  {mod.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label>
              <strong>¿Cuántas preguntas?</strong>
              <input
                type="number"
                min={1}
                max={CODE_QUIZ.filter(q => selectedModules.includes(q.type)).length || 1}
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                style={{ marginLeft: 10, width: 60 }}
                required
                disabled={selectedModules.length === 0}
              />
            </label>
          </div>
          <button
            className="sandbox-btn"
            type="submit"
            disabled={selectedModules.length === 0 || numQuestions < 1}
          >
            Empezar sesión
          </button>
        </form>
      </div>
    );
  }

  // Pantalla de quiz
  if (step === 1) {
    const quiz = questions[current];
    return (
      <div className="sandbox-product-detail-page">
        <h4>
          Pregunta {current + 1} de {questions.length}
        </h4>
        <h4>{quiz.title}</h4>
        <pre className="sandbox-codequiz-block">
          {quiz.code.map((line, idx) => (
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
              <div style={{ color: '#388e3c', fontWeight: 600 }}>¡Correcto!<br />{quiz.explanation}</div>
            ) : (
              <div style={{ color: '#e53935', fontWeight: 600 }}>Incorrecto.<br />{quiz.explanation}</div>
            )}
            <button className="sandbox-btn" style={{ marginTop: 12 }} onClick={nextQuiz}>
              {current + 1 < questions.length ? 'Siguiente' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Pantalla de resultado
  if (step === 2) {
    return (
      <div className="sandbox-product-detail-page">
        <h2>¡Sesión finalizada!</h2>
        <div style={{ fontSize: '1.2rem', margin: '18px 0' }}>
          Has acertado <strong>{correct}</strong> de <strong>{questions.length}</strong> preguntas.
        </div>
        <div style={{ fontSize: '1.1rem', marginBottom: 18 }}>
          Puntuación: <strong>{Math.round((correct / questions.length) * 100)}%</strong>
        </div>
        <button className="sandbox-btn" onClick={handleRestart}>Volver a empezar</button>
      </div>
    );
  }

  return null;
};

export default CodeQuizSession;
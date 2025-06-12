import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CodeQuiz.css';

const MODULES = [
  { id: 1, type: 'sqli', label: 'Inyección SQL' },
  { id: 2, type: 'xss', label: 'XSS' },
  { id: 3, type: 'csrf', label: 'CSRF' },
  { id: 4, type: 'bac', label: 'BAC' },
  { id: 5, type: 'ssrf', label: 'SSRF' },
  { id: 6, type: 'brokenauth', label: 'Broken Authentication' },
];

const API_URL = process.env.REACT_APP_BACKEND_URL;

function getRandomQuestions(questions, n) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const CodeQuizSession = () => {
  const [step, setStep] = useState(0); // 0: config, 1: quiz, 2: result
  const [selectedModules, setSelectedModules] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizSet, setQuizSet] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Estado para todas las preguntas del backend
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/preguntas-quiz`)
      .then(res => {
        setAllQuestions(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Configuración inicial
  const handleStart = () => {
    let filtered = allQuestions.filter(q => selectedModules.includes(q.moduloId));
    let questions = getRandomQuestions(filtered, Math.min(numQuestions, filtered.length));
    setQuizSet(questions);
    setStep(1);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCompleted(false);
  };

  // Selección de módulo
  const handleModuleChange = (id) => {
    setSelectedModules(mods =>
      mods.includes(id) ? mods.filter(m => m !== id) : [...mods, id]
    );
  };

  // Selección de respuesta
  const handleSelect = idx => {
    setSelected(idx);
    setShowResult(true);
    // Guardar la selección del usuario en la pregunta actual
    setQuizSet(prev => {
      const updated = [...prev];
      updated[current] = { ...updated[current], userSelected: idx };
      return updated;
    });
  };

  // Siguiente pregunta o resultado final
  const nextQuiz = () => {
    setSelected(null);
    setShowResult(false);
    if (current + 1 < quizSet.length) {
      setCurrent(c => c + 1);
    } else {
      setCompleted(true);
      setStep(2);
    }
  };

  // Reiniciar sesión
  const handleRestart = () => {
    setStep(0);
    setSelectedModules([]);
    setNumQuestions(5);
    setQuizSet([]);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCompleted(false);
  };

  // Pantalla de configuración
  if (step === 0) {
    const availableQuestions = allQuestions.filter(q => selectedModules.includes(q.moduloId));
    const maxQuestions = availableQuestions.length || 1;

    return (
      <div className="sandbox-product-detail-page">
        <h2>Sesión de retos de código</h2>
        {loading ? (
          <div>Cargando preguntas...</div>
        ) : (
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
                  <label key={mod.id} style={{ marginRight: 16 }}>
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(mod.id)}
                      onChange={() => handleModuleChange(mod.id)}
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
                  max={maxQuestions}
                  value={numQuestions}
                  onChange={e => setNumQuestions(Number(e.target.value))}
                  style={{ marginLeft: 10, width: 60 }}
                  required
                  disabled={selectedModules.length === 0}
                />
                <span style={{ marginLeft: 8, fontSize: '0.95em', color: '#888' }}>
                  (máx: {maxQuestions})
                </span>
              </label>
            </div>
            <button
              className="sandbox-btn"
              type="submit"
              disabled={selectedModules.length === 0 || numQuestions < 1 || numQuestions > maxQuestions}
            >
              Empezar sesión
            </button>
          </form>
        )}
      </div>
    );
  }

  // Pantalla de quiz
  if (step === 1 && quizSet.length) {
    const quiz = quizSet[current];
    return (
      <div className="sandbox-product-detail-page">
        <h4>
          Pregunta {current + 1} de {quizSet.length}
        </h4>
        <h4>{quiz.titulo}</h4>
        <pre className="sandbox-codequiz-block">
          {(quiz.codigo || []).map((line, idx) => (
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
              {current + 1 < quizSet.length ? 'Siguiente' : 'Ver resultado'}
            </button>
          </div>
        )}
        <div style={{ marginTop: 12, color: '#888', fontSize: '0.97em' }}>
          Pregunta {current + 1} de {quizSet.length}
        </div>
      </div>
    );
  }

  // Pantalla de resultado
  if (step === 2) {
    const correct = quizSet.filter(q => q.vulnerableLine === (q.userSelected ?? -1)).length;
    return (
      <div className="sandbox-product-detail-page">
        <h2>¡Sesión finalizada!</h2>
        <div style={{ fontSize: '1.2rem', margin: '18px 0' }}>
          Has completado la sesión de código.
        </div>
        <div style={{ fontSize: '1.1rem', marginBottom: 18 }}>
          Puntuación: <strong>{correct} / {quizSet.length}</strong>
        </div>
        <button className="sandbox-btn" onClick={handleRestart}>Volver a empezar</button>
      </div>
    );
  }

  return null;
};

export default CodeQuizSession;
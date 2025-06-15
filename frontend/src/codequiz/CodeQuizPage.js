import React, { useState } from 'react';
import CODE_QUIZ from './quizData';
import CodeQuiz from './CodeQuiz';
import './css/CodeQuiz.css';

const CodeQuizPage = () => {
  return (
    <div className="sandbox-product-detail-page">
      <h2>Retos de código</h2>
      <CodeQuiz questions={CODE_QUIZ} />
    </div>
  );
};

export default CodeQuizPage;
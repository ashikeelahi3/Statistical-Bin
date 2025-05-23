"use client"

import React from 'react';
import { Question } from '../types';

interface QuestionSelectorProps {
  questions: Question[];
  selectedQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ 
  questions, 
  selectedQuestionIndex, 
  onSelectQuestion 
}) => {
  return (
    <div className="mb-8">
      <label className="block text-base font-semibold mb-2 text-[var(--text-secondary)]">Select a question:</label>
      <select 
        title="question"
        className="w-full p-3 border rounded-lg border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        value={selectedQuestionIndex}
        onChange={(e) => onSelectQuestion(parseInt(e.target.value))}
      >
        {questions.map((q, index) => (
          <option key={q.id} value={index}>Question {q.id}</option>
        ))}
      </select>
    </div>
  );
};

export default QuestionSelector;

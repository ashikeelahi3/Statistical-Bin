"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { Question } from '../types';

// Dynamically import Latex component to avoid SSR issues with browser-only libraries
const Latex = dynamic(() => import('react-latex-next'), { ssr: false });

interface QuestionDisplayProps {
  selectedQuestion: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ selectedQuestion }) => {
  return (
    <div className="p-0 -m-2">
      <h2 className="text-2xl md:text-lg font-bold mb-3 text-[var(--accent)]">Question {selectedQuestion.id}</h2>
      <div className="question-text mb-4 text-lg leading-relaxed">
        <Latex>{selectedQuestion.text}</Latex>
      </div>
    </div>
  );
};

export default QuestionDisplay;

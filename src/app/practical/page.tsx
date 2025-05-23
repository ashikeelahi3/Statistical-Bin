"use client"

import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { type Question, type CodeSnippets } from './types';

// Import years directly to avoid module issues
// @ts-ignore
const yearModule = require('./years/index');
const { years, getQuestionsForSession: getQuestions, YearData, SessionData } = yearModule;

// Import components
import YearSelector from './components/YearSelector';
import SessionSelector from './components/SessionSelector';
import QuestionSelector from './components/QuestionSelector';
import QuestionDisplay from './components/QuestionDisplay';
import QuestionContent from './components/QuestionContent';
import CodeSnippetDisplay from './components/CodeSnippetDisplay';
import ToastNotification from './components/ToastNotification';
import YouTubePlayer from './components/YouTubePlayer';

// Main component for the practical questions page
export default function PracticalPage() {
  // Define a type for valid code snippet languages - must match keys in CodeSnippets interface
  type CodeLanguage = keyof CodeSnippets;
  
  // State for year and session selection
  const [selectedYearId, setSelectedYearId] = useState<string>(years[0].id);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(years[0].sessions[0].id);
  
  // Find the selected year and session objects
  const selectedYear = years.find((y: any) => y.id === selectedYearId) || years[0];
  const selectedSession = selectedYear.sessions.find((s: any) => s.id === selectedSessionId) || selectedYear.sessions[0];
  const sessionQuestions = selectedSession.questions;
  
  // State for question and language selection
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(sessionQuestions[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('python');
  const [copySuccess, setCopySuccess] = useState<string>('');
  
  // Update selected question when year or session changes
  useEffect(() => {
    const questions = selectedSession.questions;
    if (questions.length > 0) {
      setSelectedQuestionIndex(0);
      setSelectedQuestion(questions[0]);
      
      // Set the language to the first available one from the new question
      const newQuestion = questions[0];
      if (newQuestion.codeSnippets) {
        if (newQuestion.codeSnippets.python) {
          setSelectedLanguage('python');
        } else if (newQuestion.codeSnippets.r) {
          setSelectedLanguage('r');
        } else if (newQuestion.codeSnippets.cpp) {
          setSelectedLanguage('cpp');
        }
      }
    }
  }, [selectedYearId, selectedSessionId, selectedSession]);

  // Handle the question change
  const handleQuestionChange = (index: number) => {
    if (sessionQuestions[index]) {
      setSelectedQuestionIndex(index);
      setSelectedQuestion(sessionQuestions[index]);
      
      // Select the first available language when question changes
      const newQuestion = sessionQuestions[index];
      if (newQuestion.codeSnippets) {
        if (newQuestion.codeSnippets.python) {
          setSelectedLanguage('python');
        } else if (newQuestion.codeSnippets.r) {
          setSelectedLanguage('r');
        } else if (newQuestion.codeSnippets.cpp) {
          setSelectedLanguage('cpp');
        }
      }
    }
  };
  return (
    <div className="container mx-auto px-3 sm:px-6 py-8 max-w-full sm:max-w-5xl relative bg-[var(--background)] text-[var(--text-primary)]">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-[var(--accent)] tracking-tight">Statistical Practice Questions</h1>
      
      {/* Year selection component */}
      <YearSelector 
        years={years}
        selectedYearId={selectedYearId}
        onSelectYear={(yearId) => {
          setSelectedYearId(yearId);
          const selectedYear = years.find((y: any) => y.id === yearId);
          if (selectedYear && selectedYear.sessions.length > 0) {
            setSelectedSessionId(selectedYear.sessions[0].id);
          }
        }}
      />
      
      {/* Session selection component */}
      <SessionSelector
        sessions={selectedYear.sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={(sessionId) => setSelectedSessionId(sessionId)}
      />
        {/* Question selection component */}
      <QuestionSelector
        questions={sessionQuestions}
        selectedQuestionIndex={selectedQuestionIndex}
        onSelectQuestion={handleQuestionChange}
      />
      
      {/* Question display with LaTeX */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow-lg mb-8 border border-[var(--card-border)]">
        
          {/* Question text with LaTeX */}
        <QuestionDisplay selectedQuestion={selectedQuestion} />
        
        {/* Dataset display and related components */}
        {selectedQuestion.dataset && (
          <QuestionContent
            selectedQuestion={selectedQuestion}
            setCopySuccess={setCopySuccess}
          />
        )}
      </div>
        {/* Code display with language tabs */}
      <div className="bg-[var(--card-bg)] p-4 rounded shadow border border-[var(--border-color)]">
        <CodeSnippetDisplay 
          selectedQuestion={selectedQuestion}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          copySuccess={copySuccess}
          setCopySuccess={setCopySuccess}
        />
          {/* Toast notification */}
        <ToastNotification
          message={copySuccess}
        />
      </div>

      {/* YouTube video player */}
      {selectedQuestion.youTubeLink && (
        <YouTubePlayer
          selectedQuestion={selectedQuestion}
          selectedLanguage={selectedLanguage}
        />
      )}
    </div>
  )
}
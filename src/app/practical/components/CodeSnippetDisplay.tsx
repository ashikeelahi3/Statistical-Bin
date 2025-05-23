"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { Question, CodeSnippets } from '../types';
import { openInColab } from '../utils';

// Dynamically import components to avoid SSR issues with browser-only libraries
const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter/dist/cjs/prism'), { ssr: false });

// Import styles directly since they don't need to be React components
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface LanguageTabProps {
  language: string;
  isSelected: boolean;
  onClick: () => void;
}

const LanguageTab: React.FC<LanguageTabProps> = ({ language, isSelected, onClick }) => {
  const displayNames: Record<string, string> = {
    python: 'Python',
    r: 'R',
    cpp: 'C/C++'
  };

  return (
    <button 
      className={`px-3 py-2 ${isSelected ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'bg-[var(--background)] text-[var(--text-primary)]'} rounded border border-[var(--border-color)]`}
      onClick={onClick}
    >
      {displayNames[language] || language}
    </button>
  );
};

interface CodeSnippetDisplayProps {
  selectedQuestion: Question;
  selectedLanguage: keyof CodeSnippets;
  setSelectedLanguage: (language: keyof CodeSnippets) => void;
  copySuccess: string;
  setCopySuccess: (message: string) => void;
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({
  selectedQuestion,
  selectedLanguage,
  setSelectedLanguage,
  setCopySuccess
}) => {
  if (!selectedQuestion.codeSnippets || 
      (!selectedQuestion.codeSnippets.python && 
       !selectedQuestion.codeSnippets.r && 
       !selectedQuestion.codeSnippets.cpp)) {
    return (
      <div className="p-4 bg-[var(--background)] text-[var(--text-secondary)] rounded">
        No code snippets available for this question.
      </div>
    );
  }

  const handleCopyCode = () => {
    const codeText = selectedQuestion.codeSnippets[selectedLanguage];
    if (codeText) {
      navigator.clipboard.writeText(codeText)
        .then(() => {
          setCopySuccess('Copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          setCopySuccess('Failed to copy');
        });
    }
  };

  return (
    <>
      <div className="flex flex-wrap mb-4 gap-2">
        {selectedQuestion.codeSnippets?.python && (
          <LanguageTab
            language="python"
            isSelected={selectedLanguage === 'python'}
            onClick={() => setSelectedLanguage('python')}
          />
        )}

        {selectedQuestion.codeSnippets?.r && (
          <LanguageTab
            language="r"
            isSelected={selectedLanguage === 'r'}
            onClick={() => setSelectedLanguage('r')}
          />
        )}

        {selectedQuestion.codeSnippets?.cpp && (
          <LanguageTab
            language="cpp"
            isSelected={selectedLanguage === 'cpp'}
            onClick={() => setSelectedLanguage('cpp')}
          />
        )}
      </div>
      
      <div className="bg-zinc-800 p-2 sm:p-4 rounded relative">
        {/* Copy button overlay */}
        <div className="absolute top-2 right-2 z-10">
          {selectedQuestion.codeSnippets && selectedQuestion.codeSnippets[selectedLanguage] && (
            <button
              className="bg-[var(--accent)] hover:bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-1 rounded text-xs flex items-center opacity-80 hover:opacity-100"
              onClick={handleCopyCode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          )}
        </div>

        {selectedQuestion.codeSnippets && selectedQuestion.codeSnippets[selectedLanguage] ? (
          <SyntaxHighlighter 
            language={selectedLanguage}
            style={tomorrow}
            className="text-xs sm:text-sm"
            showLineNumbers={true}
            customStyle={{
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              overflow: 'auto', // keeps scrollbars for edge cases
              whiteSpace: 'pre-wrap', // allows wrapping
              wordBreak: 'break-word', // breaks long words
              width: '100%',
              margin: '0',
            }}
          >
            {selectedQuestion.codeSnippets[selectedLanguage] || ''}
          </SyntaxHighlighter>
        ) : (
          <div className="text-[var(--text-secondary)] p-4 text-center">
            No {selectedLanguage} code snippet available. Select another language.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        {selectedQuestion.codeSnippets && 
         selectedQuestion.codeSnippets[selectedLanguage] && 
         selectedQuestion.colabLinks?.[selectedLanguage] && (
          <button 
            className="px-3 py-2 bg-yellow-500 text-white rounded flex items-center text-sm"
            onClick={() => {
              const codeText = selectedQuestion.codeSnippets[selectedLanguage];
              if (codeText) {
                openInColab(
                  codeText,
                  selectedQuestion,
                  selectedLanguage,
                  setCopySuccess
                );
              }
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.9 17.152V6.8483C16.9 5.99201 16.2038 5.2959 15.3475 5.2959H8.69614C7.83986 5.2959 7.14375 5.99201 7.14375 6.8483V17.152C7.14375 18.0083 7.83986 18.7044 8.69614 18.7044H15.3475C16.2038 18.7044 16.9 18.0083 16.9 17.152Z" fill="currentColor"/>
              <path d="M10.6162 15.0659C11.0551 15.0659 11.4686 14.8265 11.4686 14.3877C11.4686 13.9489 11.0551 13.7095 10.6162 13.7095C10.1774 13.7095 9.7639 13.9489 9.7639 14.3877C9.7639 14.8265 10.1774 15.0659 10.6162 15.0659Z" fill="#FFBA00"/>
              <path d="M13.0861 8.98111C12.6473 8.98111 12.2338 9.22051 12.2338 9.65932C12.2338 10.0981 12.6473 10.3375 13.0861 10.3375C13.525 10.3375 13.9385 10.0981 13.9385 9.65932C13.9385 9.22051 13.525 8.98111 13.0861 8.98111Z" fill="#FFBA00"/>
              <path d="M13.0861 15.0659C14.2204 15.0659 15.0655 14.2208 15.0655 13.0864C15.0655 11.9521 14.2204 11.107 13.0861 11.107C11.9517 11.107 11.1066 11.9521 11.1066 13.0864C11.1066 14.2208 11.9517 15.0659 13.0861 15.0659Z" fill="white"/>
              <path d="M10.6162 10.3375C11.7505 10.3375 12.5956 9.49242 12.5956 8.35806C12.5956 7.2237 11.7505 6.37866 10.6162 6.37866C9.48183 6.37866 8.63678 7.2237 8.63678 8.35806C8.63678 9.49242 9.48183 10.3375 10.6162 10.3375Z" fill="white"/>
            </svg>
            {selectedLanguage === 'python' ? 'Open in Google Colab' : 
            selectedLanguage === 'r' ? 'Open in RStudio Cloud' : 
            'Open in Compiler Explorer'}
          </button>
        )}
      </div>
    </>
  );
};

export default CodeSnippetDisplay;

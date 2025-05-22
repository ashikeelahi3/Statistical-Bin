"use client"

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'katex/dist/katex.min.css';
import { type Question, type CodeSnippets } from './types';
import { openInColab, exportDatasetToCSV, openExternalSpreadsheet, getEmbeddableSheetUrl, getEmbeddablePdfUrl, getEmbeddableSpssUrl } from './utils';

// Import years directly to avoid module issues
// @ts-ignore
const yearModule = require('./years/index');
const { years, getQuestionsForSession: getQuestions, YearData, SessionData } = yearModule;

// Dynamically import components to avoid SSR issues with browser-only libraries
const Latex = dynamic(() => import('react-latex-next'), { ssr: false });
const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter/dist/cjs/prism'), { ssr: false });

// Import styles directly since they don't need to be React components
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// This component will render code from external files
export default function PracticalPage() {
  // Define a type for valid code snippet languages - must match keys in CodeSnippets interface
  type CodeLanguage = keyof CodeSnippets;
  
  // State for year and session selection
  const [selectedYearId, setSelectedYearId] = useState<string>(years[0].id);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(years[0].sessions[0].id);
  // const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // const [showYoutubeVideo, setShowYoutubeVideo] = useState(false);
  
  // Find the selected year and session objects
  const selectedYear = years.find((y: any) => y.id === selectedYearId) || years[0];
  const selectedSession = selectedYear.sessions.find((s: any) => s.id === selectedSessionId) || selectedYear.sessions[0];
  const sessionQuestions = selectedSession.questions;
  
  // State for question and language selection
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(sessionQuestions[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('python');
  const [copySuccess, setCopySuccess] = useState<string>('');
  
  // State for iframe visibility
  const [showExcelIframe, setShowExcelIframe] = useState<boolean>(false);
  const [showPdfIframe, setShowPdfIframe] = useState<boolean>(false);
  const [showSpssIframe, setShowSpssIframe] = useState<boolean>(false);
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
    <div className="container mx-auto px-3 sm:px-6 py-4 max-w-full sm:max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Statistical Practice Questions</h1>      {/* Year selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {years.map((year: any) => (
          <button
            key={year.id}
            className={`px-3 py-2 rounded text-sm ${
              selectedYearId === year.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => {
              setSelectedYearId(year.id);
              if (year.sessions.length > 0) {
                setSelectedSessionId(year.sessions[0].id);
              }
            }}
          >
            {year.name}
          </button>
        ))}
      </div>      {/* Session selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {selectedYear.sessions.map((session: any) => (
          <button
            key={session.id}
            className={`px-3 py-2 rounded text-sm ${
              selectedSessionId === session.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedSessionId(session.id)}
          >
            {session.name}
          </button>
        ))}
      </div>
      
      {/* Question selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select a question:</label>
        <select 
          title='question'
          className="w-full p-2 border rounded"          value={selectedQuestionIndex}          onChange={(e) => handleQuestionChange(parseInt(e.target.value))}
        >
          {sessionQuestions.map((q: any, index: number) => (
            <option key={q.id} value={index}>Question {q.id}</option>
          ))}
        </select>
      </div>
      
      {/* Question display with LaTeX */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Question {selectedQuestion.id}</h2>
        <div className="question-text">
          <Latex>{selectedQuestion.text}</Latex>
        </div>
        
        {/* Dataset display (like Excel sheet) */}
        {selectedQuestion.dataset && (
          <div className="mt-4">            <h3 className="text-lg font-medium mb-2">Dataset</h3>            {selectedQuestion.dataset.description && (
              <p className="text-sm text-gray-600 mb-2">{selectedQuestion.dataset.description}</p>
            )}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left text-xs sm:text-sm">#</th>
                      {selectedQuestion.dataset.headers.map((header, index) => (
                        <th key={index} className="border border-gray-300 px-3 py-2 text-left text-xs sm:text-sm">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuestion.dataset.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-3 py-2 text-left font-medium text-xs sm:text-sm">{rowIndex + 1}</td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-left text-xs sm:text-sm">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div><div className="mt-2 flex flex-wrap gap-2 justify-end">
              {selectedQuestion.dataset.externalLink && (
                <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center"
                  onClick={() => {
                    if (selectedQuestion.dataset?.externalLink) {
                      openExternalSpreadsheet(selectedQuestion.dataset.externalLink, setCopySuccess);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Sheets
                </button>                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs flex items-center"
                  onClick={() => {
                    setShowExcelIframe(!showExcelIframe);
                    setShowPdfIframe(false); // Close PDF iframe if open
                    setShowSpssIframe(false); // Close SPSS iframe if open
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {showExcelIframe ? 'Hide Spreadsheet' : 'View Spreadsheet'}
                </button>
                </>
              )}
              {selectedQuestion.dataset.pdfLink && (                
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center"
                  onClick={() => {
                    setShowPdfIframe(!showPdfIframe);
                    setShowExcelIframe(false); // Close Excel iframe if open
                    setShowSpssIframe(false); // Close SPSS iframe if open
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {showPdfIframe ? 'Hide PDF' : 'View PDF'}
                </button>
              )}
              {selectedQuestion.dataset.spssLink && (
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs flex items-center"
                  onClick={() => {
                    setShowSpssIframe(!showSpssIframe);
                    setShowExcelIframe(false); // Close Excel iframe if open
                    setShowPdfIframe(false); // Close PDF iframe if open
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {showSpssIframe ? 'Hide SPSS' : 'View SPSS'}
                </button>
              )}<button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center"
                onClick={() => {
                  if (selectedQuestion.dataset) {
                    exportDatasetToCSV(selectedQuestion.dataset, selectedQuestion.id, setCopySuccess, 'csv');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Dataset
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs flex items-center"
                onClick={() => {
                  if (selectedQuestion.dataset) {
                    exportDatasetToCSV(selectedQuestion.dataset, selectedQuestion.id, setCopySuccess, 'spss');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download SPSS
              </button>
            </div>
            
            {/* Embeddable iframes for Excel/Sheets and PDF */}
            {showExcelIframe && selectedQuestion.dataset.externalLink && (
              <div className="mt-4">
                <div className="bg-gray-200 p-1 rounded">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <h4 className="text-gray-700 font-medium">Spreadsheet Viewer</h4>                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowExcelIframe(false)}
                      title="Close spreadsheet viewer"
                      aria-label="Close spreadsheet viewer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>                  <iframe 
                    src={getEmbeddableSheetUrl(selectedQuestion.dataset.externalLink)}
                    className="w-full border-0 rounded" 
                    height={350}
                    title="Spreadsheet Viewer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            {showPdfIframe && selectedQuestion.dataset.pdfLink && (
              <div className="mt-4">
                <div className="bg-gray-200 p-1 rounded">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <h4 className="text-gray-700 font-medium">PDF Viewer</h4>                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPdfIframe(false)}
                      title="Close PDF viewer"
                      aria-label="Close PDF viewer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>                  <iframe 
                    src={getEmbeddablePdfUrl(selectedQuestion.dataset.pdfLink)}
                    className="w-full border-0 rounded" 
                    height={400}
                    title="PDF Document Viewer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            {showSpssIframe && selectedQuestion.dataset.spssLink && (
              <div className="mt-4">
                <div className="bg-gray-200 p-1 rounded">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <h4 className="text-gray-700 font-medium">SPSS Data Viewer</h4>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowSpssIframe(false)}
                      title="Close SPSS viewer"
                      aria-label="Close SPSS viewer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>                  <iframe 
                    src={getEmbeddableSpssUrl(selectedQuestion.dataset.spssLink)}
                    className="w-full border-0 rounded" 
                    height={400}
                    title="SPSS Data Viewer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Code display with language tabs */}
      <div className="bg-white p-4 rounded shadow">
        {/* Check if any code snippet languages are available */}
        {(!selectedQuestion.codeSnippets || 
          (!selectedQuestion.codeSnippets.python && 
           !selectedQuestion.codeSnippets.r && 
           !selectedQuestion.codeSnippets.cpp)) ? (
          <div className="p-4 bg-gray-100 text-gray-600 rounded">
            No code snippets available for this question.
          </div>
        ) : (
          <>
                <div className="flex flex-wrap mb-4 gap-2">
                {selectedQuestion.codeSnippets?.python && (
                  <button 
                    className={`px-3 py-2 ${selectedLanguage === 'python' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    onClick={() => setSelectedLanguage('python')}
                  >
                    Python
                  </button>
                )}
                {selectedQuestion.codeSnippets?.r && (
                  <button 
                    className={`px-3 py-2 ${selectedLanguage === 'r' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    onClick={() => setSelectedLanguage('r')}
                  >
                    R
                  </button>
                )}
                {selectedQuestion.codeSnippets?.cpp && (
                  <button 
                    className={`px-3 py-2 ${selectedLanguage === 'cpp' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    onClick={() => setSelectedLanguage('cpp')}
                  >
                    C/C++
                  </button>
                )}
              </div>
              
            
            {/* Code snippet */}        
            <div className="bg-zinc-800 p-2 sm:p-4 rounded relative">
              {/* Copy button overlay */}
              <div className="absolute top-2 right-2 z-10">
                {selectedQuestion.codeSnippets && selectedQuestion.codeSnippets[selectedLanguage] && (
                  <button
                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs flex items-center"
                    onClick={() => {
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
                    }}
                  >
                    {copySuccess || (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              {selectedQuestion.codeSnippets && selectedQuestion.codeSnippets[selectedLanguage] ? (
                <SyntaxHighlighter 
                  language={selectedLanguage}
                  style={ tomorrow }
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
                <div className="text-gray-400 p-4 text-center">
                  No {selectedLanguage} code snippet available. Select another language.
                </div>
              )}
            </div>
            
            {/* View in online editor button for all languages */}
            <div className="mt-4 flex justify-end">
              {selectedQuestion.codeSnippets && selectedQuestion.codeSnippets[selectedLanguage] && selectedQuestion.colabLinks?.[selectedLanguage] && (
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
        )}
        
        {/* Toast notification */}
        {copySuccess && (
          <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-3 py-2 rounded shadow-lg flex items-center transition-opacity duration-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {copySuccess}
          </div>
        )}
      </div>
    </div>
  )
}
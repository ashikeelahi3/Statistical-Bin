"use client"

import React from 'react';
import { Question } from '../types';
import { 
  openExternalSpreadsheet,
  exportDatasetToCSV
} from '../utils';

interface DatasetActionsProps {
  selectedQuestion: Question;
  setCopySuccess: (message: string) => void;
  setShowExcelIframe: (show: boolean) => void;
  showExcelIframe: boolean;
  setShowPdfIframe: (show: boolean) => void;
  showPdfIframe: boolean;
  setShowSpssIframe: (show: boolean) => void;
  showSpssIframe: boolean;
}

const DatasetActions: React.FC<DatasetActionsProps> = ({
  selectedQuestion,
  setCopySuccess,
  setShowExcelIframe,
  showExcelIframe,
  setShowPdfIframe,
  showPdfIframe,
  setShowSpssIframe,
  showSpssIframe
}) => {
  if (!selectedQuestion.dataset) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2 justify-end">
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
          </button>
          
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs flex items-center"
            onClick={() => {
              setShowExcelIframe(!showExcelIframe);
              setShowPdfIframe(false);
              setShowSpssIframe(false);
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
            setShowExcelIframe(false);
            setShowSpssIframe(false);
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
            setShowExcelIframe(false);
            setShowPdfIframe(false);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {showSpssIframe ? 'Hide SPSS' : 'View SPSS'}
        </button>
      )}

      <button
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
  );
};

export default DatasetActions;

"use client"

import React, { useState } from 'react';
import { Question } from '../types';
import DatasetDisplay from './DatasetDisplay';
import DatasetActions from './DatasetActions';
import IframeViewer from './IframeViewer';

interface QuestionContentProps {
  selectedQuestion: Question;
  setCopySuccess: (message: string) => void;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
  selectedQuestion,
  setCopySuccess
}) => {
  // State for iframe visibility
  const [showExcelIframe, setShowExcelIframe] = useState<boolean>(false);
  const [showPdfIframe, setShowPdfIframe] = useState<boolean>(false);
  const [showSpssIframe, setShowSpssIframe] = useState<boolean>(false);

  // Don't render anything if no dataset present
  if (!selectedQuestion.dataset) {
    return null;
  }

  return (
    <>
      <DatasetDisplay 
        headers={selectedQuestion.dataset.headers}
        rows={selectedQuestion.dataset.rows}
        description={selectedQuestion.dataset.description}
      />
      
      <DatasetActions
        selectedQuestion={selectedQuestion}
        setCopySuccess={setCopySuccess}
        setShowExcelIframe={setShowExcelIframe}
        showExcelIframe={showExcelIframe}
        setShowPdfIframe={setShowPdfIframe}
        showPdfIframe={showPdfIframe}
        setShowSpssIframe={setShowSpssIframe}
        showSpssIframe={showSpssIframe}
      />
      
      {/* Embeddable iframes for Excel/Sheets, PDF and SPSS */}
      {selectedQuestion.dataset.externalLink && (
        <IframeViewer
          type="excel"
          url={selectedQuestion.dataset.externalLink}
          show={showExcelIframe}
          onClose={() => setShowExcelIframe(false)}
        />
      )}
      
      {selectedQuestion.dataset.pdfLink && (
        <IframeViewer
          type="pdf"
          url={selectedQuestion.dataset.pdfLink}
          show={showPdfIframe}
          onClose={() => setShowPdfIframe(false)}
        />
      )}
      
      {selectedQuestion.dataset.spssLink && (
        <IframeViewer
          type="spss"
          url={selectedQuestion.dataset.spssLink}
          show={showSpssIframe}
          onClose={() => setShowSpssIframe(false)}
        />
      )}
    </>
  );
};

export default QuestionContent;

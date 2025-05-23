"use client"

import React from 'react';
import { 
  getEmbeddableSheetUrl,
  getEmbeddablePdfUrl,
  getEmbeddableSpssUrl
} from '../utils';

interface IframeViewerProps {
  type: 'excel' | 'pdf' | 'spss';
  url: string;
  show: boolean;
  onClose: () => void;
}

const IframeViewer: React.FC<IframeViewerProps> = ({ 
  type, 
  url, 
  show, 
  onClose 
}) => {
  if (!show || !url) {
    return null;
  }

  // Get the appropriate title and embeddable URL based on type
  let title: string;
  let embeddableUrl: string;
  let height: number;

  switch (type) {
    case 'excel':
      title = 'Spreadsheet Viewer';
      embeddableUrl = getEmbeddableSheetUrl(url);
      height = 350;
      break;
    case 'pdf':
      title = 'PDF Viewer';
      embeddableUrl = getEmbeddablePdfUrl(url);
      height = 400;
      break;
    case 'spss':
      title = 'SPSS Data Viewer';
      embeddableUrl = getEmbeddableSpssUrl(url);
      height = 400;
      break;
    default:
      return null;
  }

  return (
    <div className="mt-4">
      <div className="bg-[var(--card-bg)] p-1 rounded border border-[var(--border-color)]">
        <div className="flex justify-between items-center mb-2 px-2">
          <h4 className="text-[var(--text-primary)] font-medium">{title}</h4>
          <button 
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={onClose}
            title={`Close ${title.toLowerCase()}`}
            aria-label={`Close ${title.toLowerCase()}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <iframe 
          src={embeddableUrl}
          className="w-full border-0 rounded" 
          height={height}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default IframeViewer;

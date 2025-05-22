// Utility functions for working with code snippets and notebooks
import { type Question } from './types';

/**
 * Opens code in Google Colab or a new tab based on the selected language
 * 
 * @param code The code snippet to open
 * @param selectedQuestion The currently selected question
 * @param selectedLanguage The currently selected language
 * @param setCopySuccess Callback to set copy success message
 */
export function openInColab(
  code: string, 
  selectedQuestion: Question, 
  selectedLanguage: string, 
  setCopySuccess: (message: string) => void
): void {
  if (selectedLanguage === 'python' || selectedLanguage === 'r' || selectedLanguage === 'cpp') {
    // Use language-specific link
    const colabLink = selectedQuestion.colabLinks[selectedLanguage as 'python' | 'r' | 'cpp'];
    
    if (colabLink) {
      // Use the pre-created link if available
      window.open(colabLink);
    } else {
      // Fallback based on language
      if (selectedLanguage === 'cpp') {
        // For C/C++, open in Compiler Explorer (Godbolt)
        const newWindow = window.open('https://godbolt.org/');
        
        // Copy code to clipboard for pasting
        navigator.clipboard.writeText(code)
          .then(() => {
            setCopySuccess('Code copied! Paste into Compiler Explorer with Ctrl+V');
            setTimeout(() => setCopySuccess(''), 5000);
          })
          .catch(err => {
            console.error('Failed to copy:', err);
            setCopySuccess('Click Copy button then paste in Compiler Explorer');
            setTimeout(() => setCopySuccess(''), 5000);
          });
      } else {
        // For Python/R, open in Colab
        const newWindow = window.open('https://colab.research.google.com');
        
        // Format code to include the question as a comment header
        const questionText = selectedQuestion.text.replace(/\$/g, '').replace(/\n/g, ' ');
        const codeWithHeader = `# ${questionText}\n\n${code}`;
        
        // Copy to clipboard and show notification
        navigator.clipboard.writeText(codeWithHeader)
          .then(() => {
            setCopySuccess('Code copied! Paste into Colab with Ctrl+V');
            setTimeout(() => setCopySuccess(''), 5000);
          })
          .catch(err => {
            console.error('Failed to copy:', err);
            setCopySuccess('Click Copy button then paste in Colab');
            setTimeout(() => setCopySuccess(''), 5000);
          });
      }
    }
  } else {
    // For other languages, we'll just open the code in a new tab with syntax highlighting
    const newTab = window.open('');
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>${selectedLanguage.toUpperCase()} Code</title>
            <style>
              body { background: #1e1e1e; color: #ddd; font-family: monospace; padding: 20px; }
              pre { background: #2d2d2d; padding: 15px; border-radius: 5px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h2 style="color: #eee;">${selectedLanguage.toUpperCase()} Code Sample</h2>
            <pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </body>
        </html>
      `);      newTab.document.close();
    }
  }
}

/**
 * Converts a dataset to CSV format and triggers a download
 * 
 * @param dataset The dataset to convert
 * @param questionId The question ID for the filename
 * @param setCopySuccess Callback to set success message
 * @param format The format to download as ('csv' or 'excel')
 */
export function exportDatasetToCSV(
  dataset: { headers: string[]; rows: (string | number)[][] },
  questionId: number,
  setCopySuccess: (message: string) => void,
  format: 'csv' | 'excel' | 'spss' = 'csv'
): void {
  // Create CSV content
  const headers = dataset.headers.join(',');
  
  // Ensure each row is properly formatted as CSV
  const rows = dataset.rows.map(row => {
    return row.map(cell => {
      // Wrap strings containing commas in quotes
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell}"`;
      }
      return cell;
    }).join(',');
  }).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  
  // Determine file type and extension based on format
  let fileType: string;
  let extension: string;
  
  switch(format) {
    case 'excel':
      fileType = 'application/vnd.ms-excel';
      extension = 'xlsx';
      break;
    case 'spss':
      fileType = 'application/x-spss-sav';
      extension = 'sav';
      break;
    default: // csv
      fileType = 'text/csv';
      extension = 'csv';
  }
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: fileType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `question_${questionId}_dataset.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  const formatName = format === 'spss' ? 'SPSS' : format.toUpperCase();
  setCopySuccess(`Dataset downloaded as ${formatName}`);
  setTimeout(() => setCopySuccess(''), 2000);
}

/**
 * Opens an external spreadsheet link in a new tab
 * 
 * @param url The URL of the external spreadsheet
 * @param setCopySuccess Callback to set success message
 */
export function openExternalSpreadsheet(
  url: string,
  setCopySuccess: (message: string) => void
): void {
  // Check if it's a Google Sheets URL
  const isGoogleSheet = url.includes('docs.google.com/spreadsheets');
  
  // Open the URL in a new tab
  window.open(url, '_blank');
  
  // Display a success message
  setCopySuccess(`Opened in ${isGoogleSheet ? 'Google Sheets' : 'external spreadsheet'}`);
  setTimeout(() => setCopySuccess(''), 2000);
}

/**
 * Converts a Google Sheets URL to an embeddable iframe URL
 * 
 * @param url The original Google Sheets URL
 * @returns URL that can be used in an iframe src attribute
 */
export function getEmbeddableSheetUrl(url: string): string {
  if (!url) return '';
  
  // Convert standard Google Sheets URL to embeddable format
  if (url.includes('docs.google.com/spreadsheets')) {
    // For Google Sheets, convert to embedded format
    // Replace /edit with /preview or use /htmlembed if it's a publicly shared sheet
    return url.replace('/edit', '/preview');
  }
  
  // For other URLs, return as is (assuming they're already embeddable)
  return url;
}

/**
 * Gets an embeddable URL for a PDF document
 * 
 * @param url The original PDF URL
 * @returns URL that can be used in an iframe src attribute
 */
export function getEmbeddablePdfUrl(url: string): string {
  if (!url) return '';
  
  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com/file/d/')) {
    // Extract the file ID from the Google Drive URL
    const fileIdMatch = url.match(/\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Return direct Google Drive embed URL
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }
  
  // For other URLs, use Google Docs viewer
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

/**
 * Gets an embeddable URL for an SPSS file
 * 
 * @param url The original SPSS file URL
 * @returns URL that can be used in an iframe src attribute
 */
export function getEmbeddableSpssUrl(url: string): string {
  if (!url) return '';
  
  // Since SPSS files can't be directly embedded, we use a viewer
  // This uses Google Drive viewer if it's a Google Drive file
  if (url.includes('drive.google.com')) {
    return url.replace('/view', '/preview');
  }
  
  // For other URLs, we could use a generic file viewer
  // Note: Most browsers can't natively display SPSS files
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

// Types for notebook structures and other interfaces

// Notebook cell structure
export interface NotebookCell {
  cell_type: string;
  execution_count: number | null;
  metadata: Record<string, any>;
  outputs: any[];
  source: string[];
}

// Notebook kernel specification
export interface NotebookKernelspec {
  display_name: string;
  language: string;
  name: string;
}

// Notebook language information
export interface NotebookLanguageInfo {
  name: string;
}

// Notebook metadata structure
export interface NotebookMetadata {
  kernelspec: NotebookKernelspec;
  language_info: NotebookLanguageInfo;
}

// Complete notebook JSON structure
export interface NotebookJSON {
  cells: NotebookCell[];
  metadata: NotebookMetadata;
  nbformat: number;
  nbformat_minor: number;
}


// Structure to organize years and sessions
export interface YearData {
  id: string;
  name: string;
  sessions: SessionData[];
  allQuestions?: Question[]; // All questions from all sessions combined
}

export interface SessionData {
  id: string;
  name: string;
  questions: Question[];
}

// Sample question data structure for statistical practice questions
export interface CodeSnippets {
  python?: string;
  r?: string;
  cpp?: string;
}

export interface Question {
  id: number;
  text: string;
  colabLinks: {
    python?: string;
    r?: string;
    cpp?: string; // Link for C/C++ code in a code viewer
  };
  codeSnippets: CodeSnippets;  dataset?: {
    headers: string[];
    rows: (string | number)[][];
    description?: string;
    externalLink?: string; // Link to external Google Sheet or Excel file
    pdfLink?: string; // Link to a PDF document relevant to the question
    spssLink?: string; // Link to an SPSS file for analysis
  };
}


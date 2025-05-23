// Year and session structure for statistical practice questions
import { Question } from '@/app/practical/types'; // Import the Question interface

// Import the combined files for each year (contains all questions combined)
import * as FirstYear from './1st_year/1st_year';
import * as SecondYear from './2nd_year/2nd_year';
import * as ThirdYear from './3rd_year/3rd_year';
import * as FourthYear from './4th_year/4th_year';
// import * as FinalYear from './final_year/final_year';

import { YearData, SessionData } from '@/app/practical/types';

// Define all available years and their sessions
export const years: YearData[] = [  {    id: '1st_year',
    name: '1st Year',
    // All questions combined from all sessions (merged view)
    allQuestions: FirstYear.allQuestions,
    sessions: [
      {
        id: 'session1',
        name: 'Session 1',
        questions: FirstYear.session1Questions
      },
      {
        id: 'session2',
        name: 'Session 2',
        questions: FirstYear.session2Questions
      },
      {
        id: 'session3',
        name: 'Session 3',
        questions: FirstYear.session3Questions
      }
      // Add more sessions as needed
    ]
  },  {
    id: '2nd_year',
    name: '2nd Year',
    // All questions combined from all sessions (merged view)
    allQuestions: SecondYear.allQuestions,
    sessions: [
      {
        id: 'session1',
        name: 'Session 1',
        questions: SecondYear.session1Questions
      },
      {
        id: 'session2',
        name: 'Session 2',
        questions: SecondYear.session2Questions
      },
      {
        id: 'session3',
        name: 'Session 3',
        questions: SecondYear.session3Questions
      }
      // Add more sessions as needed
    ]
  },  {
    id: '3rd_year',
    name: '3rd Year',
    // All questions combined from all sessions
    allQuestions: ThirdYear.allQuestions,
    sessions: [
      {
        id: 'session1',
        name: 'Session 1',
        questions: ThirdYear.session1Questions
      },
      {
        id: 'session2',
        name: 'Session 2',
        questions: ThirdYear.session2Questions
      },
      {
        id: 'session3',
        name: 'Session 3',
        questions: ThirdYear.session3Questions
      }
      // Add more sessions as needed
    ]
  },  {
    id: '4th_year',
    name: '4th Year',
    // All questions combined from all sessions
    allQuestions: FourthYear.allQuestions,
    sessions: [
      {
        id: 'session1',
        name: 'Session 1',
        questions: FourthYear.session1Questions
      },
      {
        id: 'session2',
        name: 'Session 2',
        questions: FourthYear.session2Questions
      },
      {
        id: 'session3',
        name: 'Session 3',
        questions: FourthYear.session3Questions
      }
      // Add more sessions as needed
    ]
  },  
  // {
  //   id: 'final_year',
  //   name: 'Final Year',
  //   // All questions combined from all sessions
  //   allQuestions: FinalYear.allQuestions,
  //   sessions: [
  //     {
  //       id: 'session1',
  //       name: 'Session 1',
  //       questions: FinalYear.session1Questions
  //     },
  //     {
  //       id: 'session2',
  //       name: 'Session 2',
  //       questions: FinalYear.session2Questions
  //     },
  //     {
  //       id: 'session3',
  //       name: 'Session 3',
  //       questions: FinalYear.session3Questions
  //     }
  //     // Add more sessions as needed
  //   ]
  // }
];

// Helper function to get a specific year by ID
export function getYear(yearId: string): YearData | undefined {
  return years.find(year => year.id === yearId);
}

// Helper function to get a specific session by year ID and session ID
export function getSession(yearId: string, sessionId: string): SessionData | undefined {
  const year = getYear(yearId);
  if (!year) return undefined;
  return year.sessions.find(session => session.id === sessionId);
}

// Helper function to get questions for a specific session
export function getQuestionsForSession(yearId: string, sessionId: string): Question[] {
  const session = getSession(yearId, sessionId);
  return session ? session.questions : [];
}

// Helper function to get all questions for a year
export function getAllQuestionsForYear(yearId: string): Question[] {
  const year = getYear(yearId);
  return year?.allQuestions || year?.sessions.flatMap(session => session.questions) || [];
}

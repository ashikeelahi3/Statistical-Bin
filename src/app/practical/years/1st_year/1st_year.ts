import { Question } from '@/app/practical/types';

// Import all question modules from session1
import { question as session1Question1 } from './session1_questions/question1';
import { question as session1Question2 } from './session1_questions/question2';
import { question as session1Question3 } from './session1_questions/question3';
import { question as session1Question4 } from './session1_questions/question4';

// Import all question modules from session2
import { question as session2Question1 } from './session2_questions/question1';
import { question as session2Question2 } from './session2_questions/question2';

// Import all question modules from session3
import { question as session3Question1 } from './session3_questions/question1';


// Group questions by session
export const session1Questions: Question[] = [
  session1Question1,
  session1Question2,
  session1Question3,
  session1Question4,
]

export const session2Questions: Question[] = [
  session2Question1,
  session2Question2,
]

export const session3Questions: Question[] = [
  session3Question1,
]

// Combine all questions into a single array
export const allQuestions: Question[] = [
  ...session1Questions,
  ...session2Questions,
  ...session3Questions,
]

// For backward compatibility, export the original arrays as well
export const questions = allQuestions;
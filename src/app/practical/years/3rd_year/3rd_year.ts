import { Question } from '@/app/practical/types';

// Import all question modules from session1
import { question as session1Question1 } from './session1_questions/question1';
import { question as session1Question2 } from './session1_questions/question2';
import { question as session1Question3 } from './session1_questions/question3';

// Import all question modules from session2
import { question as session2Question1 } from './session2_questions/question1';
import { question as session2Question2 } from './session2_questions/question2';
import { question as session2Question3 } from './session2_questions/question3';

// Import all question modules from session3
import { question as session3Question1 } from './session3_questions/question1';
import { question as session3Question2 } from './session3_questions/question2';
import { question as session3Question3 } from './session3_questions/question3';

// Import all question modules from session4
import { question as session4Question1 } from './session4_questions/question1';
// import { question as session4Question2 } from './session4_questions/question2';
import { question as session4Question3 } from './session4_questions/question3';

// Group questions by session
export const session1Questions: Question[] = [
  session1Question1,
  session1Question2,
  session1Question3,
]
export const session2Questions: Question[] = [
  session2Question1,
  session2Question2,
  session2Question3,
]
export const session3Questions: Question[] = [
  session3Question1,
  session3Question2,
  session3Question3,
]

export const session4Questions: Question[] = [
  session4Question1,
  // session4Question2,
  session4Question3,
]

// Combine all questions into a single array
export const allQuestions: Question[] = [
  ...session1Questions,
  ...session2Questions,
  ...session3Questions,
  ...session4Questions
]
// For backward compatibility, export the original arrays as well
export const questions = allQuestions;
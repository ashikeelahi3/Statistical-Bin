# Question Organization System

This project uses a structured approach to organize statistical practice questions in a maintainable way.

## Structure

- Each year has its own directory in `src/app/practical/years/`
- Each year has multiple session files (e.g., `session1.ts`, `session2.ts`)
- Questions for each session are stored in dedicated directories (e.g., `session1_questions/`)
- Each question is defined in its own file with a consistent structure
- A combined file named after the year directory (e.g., `1st_year.ts`) combines questions from all sessions in that year

## File Naming Convention

- Year directories: `1st_year`, `2nd_year`, etc.
- Session files: `session1.ts`, `session2.ts`, etc.
- Question directories: `session1_questions`, `session2_questions`, etc.
- Question files: `question1.ts`, `question2.ts`, etc.
- Combined year files: Same as the directory name (e.g., `1st_year.ts`)

## Question Organization Options

This system provides two ways to organize and access questions:

1. **By Individual Session**: Access questions from specific sessions using the session files
2. **All Sessions Combined**: Access all questions for a year using the year file (e.g., `1st_year.ts`)

## Adding New Questions

### Method 1: Using the Question Creator Script (Recommended)

1. Run the following command to create a new question file with a template:
   ```bash
   npm run create-question 1st_year session1 5
   ```
   Replace `1st_year`, `session1`, and `5` with the appropriate year, session, and question ID.

2. Edit the generated file to fill in your question details.

3. Run the update script to refresh all imports and update the year file:
   ```bash
   npm run update-questions
   ```

### Method 2: Manual Creation

1. Create a new question file in the appropriate session's questions directory.
   For example: `src/app/practical/years/1st_year/session1_questions/question4.ts`

2. Follow the standard question template:
   ```typescript
   import { Question } from '@/app/practical/types';

   export const question: Question = {
     id: 4, // Use the next available ID in the sequence
     text: "Question text here...",
     colabLinks: {
       python: "https://colab.link/...",
       r: "https://r-link/...",
       cpp: "https://cpp-link/..."
     },
     dataset: {
       // Dataset properties if needed
     },
     codeSnippets: {
       python: `# Python code here...`,
       r: `# R code here...`,
       cpp: `// C++ code here...`
     }
   };
   ```

3. Run the update script:
   ```bash
   npm run update-questions
   ```

## Merged Sessions Approach

The year file (e.g., `1st_year.ts`) automatically:

1. Imports all questions from all session directories
2. Adds session information to each question
3. Organizes questions by session
4. Combines all questions into a single array
5. Updates whenever you run `npm run update-questions`

This allows you to work with individual sessions or use the combined view as needed.

## Technical Details

- We use static imports rather than dynamic imports for better compatibility with Next.js
- The auto-generation script maintains the imports list to ensure all questions are included
- Questions are sorted by their ID property to maintain consistent ordering
- In the combined view, question IDs are modified (sessionNumber * 100 + questionId) to ensure uniqueness

## Best Practices

- Give each question a unique ID within its session
- Keep question files focused on a single question
- Use consistent formatting for mathematical notation (`$` for inline, `$$` for block equations)
- Run the update script after adding or removing question files

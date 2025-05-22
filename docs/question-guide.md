# Statistical Questions Organization Guide

This document provides a quick reference for the question organization system in the Statistical-Bin project.

## System Overview

Questions are organized in a hierarchical structure:
- By **year** (1st_year, 2nd_year, etc.)
- By **session** within each year (session1, session2, etc.)
- As **individual question files** within session-specific directories

## File Structure

```
src/app/practical/years/
  ├── 1st_year/                  # Year directory
  │   ├── 1st_year.ts            # Combined file with all questions for this year
  │   ├── session1.ts            # Individual session file
  │   ├── session2.ts
  │   ├── session3.ts
  │   ├── session1_questions/    # Directory for session1 questions
  │   │   ├── question1.ts       # Individual question file
  │   │   ├── question2.ts
  │   │   └── ...
  │   ├── session2_questions/
  │   └── session3_questions/
  ├── 2nd_year/
  │   ├── 2nd_year.ts
  │   └── ...
  └── ...
```

## How to Use

### Adding a New Question

1. Use the question creator script:
   ```bash
   npm run create-question 1st_year session1 5
   ```

2. Edit the generated template file with your question content.

3. Run the update script to refresh imports:
   ```bash
   npm run update-questions
   ```

### Importing Questions

In your code, you can import questions in two ways:

**1. Individual Session Questions:**
```typescript
import { questions as session1Questions } from './1st_year/session1';
```

**2. All Questions for a Year:**
```typescript
import { allQuestions as firstYearQuestions } from './1st_year/1st_year';
```

## Best Practices

1. **Consistent IDs**: Use sequential IDs for questions within each session
2. **Descriptive Text**: Make question text clear and descriptive
3. **Run the Update Script**: Always run `npm run update-questions` after adding/modifying questions
4. **Year File Naming**: The combined year file should match the directory name (e.g., `1st_year.ts`)

## Common Tasks

- **Add a new session**: Create a new `sessionX.ts` file and a `sessionX_questions` directory
- **Add a question to existing session**: Use the create-question script
- **View all questions for a year**: Import from the year file (e.g., `1st_year.ts`)

## Script Reference

- `npm run create-question <year> <session> <id>`: Create a new question file
- `npm run update-questions`: Update all import files after adding/modifying questions

For more detailed information, see the [question-organization.md](./question-organization.md) file.

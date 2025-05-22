/**
 * This script creates a new question file from a template.
 * 
 * Usage: node scripts/create-question.js <year> <session> <id>
 * Example: node scripts/create-question.js 1st_year session1 5
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node scripts/create-question.js <year> <session> <id>');
  console.error('Example: node scripts/create-question.js 1st_year session1 5');
  process.exit(1);
}

const year = args[0];
const session = args[1];
const questionId = parseInt(args[2], 10);

if (isNaN(questionId)) {
  console.error('Error: Question ID must be a number');
  process.exit(1);
}

// Base directory
const BASE_DIR = path.join(__dirname, '..', 'src', 'app', 'practical', 'years');
const questionDir = path.join(BASE_DIR, year, `${session}_questions`);
const questionFilePath = path.join(questionDir, `question${questionId}.ts`);

// Check if the directory exists
if (!fs.existsSync(questionDir)) {
  console.log(`Creating directory: ${questionDir}`);
  fs.mkdirSync(questionDir, { recursive: true });
}

// Check if the file already exists
if (fs.existsSync(questionFilePath)) {
  console.error(`Error: File already exists: ${questionFilePath}`);
  process.exit(1);
}

// Template for the question file
const questionTemplate = `import { Question } from '@/app/practical/types';

// Question ${questionId} for ${year.replace('_', ' ')}, ${session}
export const question: Question = {
  id: ${questionId},
  text: "${year.replace('_', ' ')}, ${session}: [YOUR QUESTION TEXT HERE]",
  colabLinks: {
    python: "https://colab.research.google.com/drive/your-python-link",
    r: "https://rstudio.cloud/project/your-r-link",
    cpp: "https://godbolt.org/your-cpp-link"
  },
  dataset: {
    headers: ["Header1", "Header2", "Header3"],
    rows: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    description: "Description of your dataset."
  },
  codeSnippets: {
    python: \`# Your Python code here
import numpy as np
import matplotlib.pyplot as plt

# Example code
data = [1, 2, 3, 4, 5]
print("Mean:", np.mean(data))
\`,
    r: \`# Your R code here
data <- c(1, 2, 3, 4, 5)
cat("Mean:", mean(data), "\\n")
\`,
    cpp: \`// Your C++ code here
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    double mean = std::accumulate(data.begin(), data.end(), 0.0) / data.size();
    std::cout << "Mean: " << mean << std::endl;
    return 0;
}
\`
  }
};`;

// Write the template to the file
fs.writeFileSync(questionFilePath, questionTemplate);
console.log(`Created question file: ${questionFilePath}`);

// Check if the year file exists
const yearFilePath = path.join(BASE_DIR, year, `${year}.ts`);
if (fs.existsSync(yearFilePath)) {
  console.log(`\nDetected ${year}.ts file. This will be automatically updated with your new question.`);
}

// Remind the user to run the update script
console.log('\nRemember to run the update script:');
console.log('npm run update-questions');

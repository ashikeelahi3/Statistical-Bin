import { Question } from '@/app/practical/types';

// Question 1 for 4th year, session1
export const question: Question = {
  id: 1,
  text: "Suppose you are attempting to model the likelihood of early termination from counseling in a sample of $n = 45$ clients at a community mental health center. The dependent variable in the model is 'Terminate' (coded as: 1 = terminated early, 0 = did not terminate early). Three predictors in the model are: <br/> 1. Gender (coded as: 0 = Male, 1 = Female), <br/> 2. Income (coded as: 1 = low income, 2 = medium income, 3 = high income), <br/> 3. Symptom severity (continuous scale). <br/> <b>Run a suitable regression model and interpret the role Of each predictor in the model.</b>",
  colabLinks: {
    python: "",
    r: "",
    cpp: ""
  },
  youTubeLink: {
    r: "",
    python: "",
    cpp:"",
    spss: "",
    excel: ""
  },
  dataset: {
    headers: ["SL", "Terminate", "Symptom of severity", "Gender", "Wealth Index"],
    rows: [
      [1, 0, 12, 1, 1],
      [2, 0, 14, 0, 1],
      [3, 0, 19, 1, 1],
      [4, 0, 22, 1, 1],
      [5, 0, 16, 0, 1],
      [6, 0, 18, 1, 2],
      [7, 0, 17, 0, 1],
      [8, 0, 15, 1, 1],
      [9, 0, 14, 0, 1],
      [10, 0, 8, 1, 1],
      [11, 0, 7, 1, 2],
      [12, 0, 9, 0, 3],
      [13, 0, 12, 0, 3],
      [14, 0, 15, 0, 3],
      [15, 0, 17, 1, 1],
      [16, 0, 18, 0, 1],
      [17, 0, 14, 0, 1],
      [18, 0, 13, 1, 2],
      [19, 0, 10, 1, 3],
      [20, 0, 8, 0, 3],
      [21, 0, 4, 1, 1],
      [22, 0, 18, 0, 2],
      [23, 0, 16, 1, 3],
      [24, 0, 19, 1, 3],
      [25, 0, 14, 1, 3],
      [26, 1, 15, 0, 1],
      [27, 1, 14, 0, 1],
      [28, 1, 8, 0, 3],
      [29, 1, 9, 0, 3],
      [30, 1, 11, 0, 2],
      [31, 1, 10, 0, 2],
      [32, 1, 4, 0, 2],
      [33, 1, 9, 1, 1],
      [34, 1, 8, 1, 1],
      [35, 1, 14, 0, 1],
      [36, 1, 13, 0, 2],
      [37, 1, 12, 1, 3],
      [38, 1, 8, 0, 1],
      [39, 1, 4, 0, 1],
      [40, 1, 6, 1, 2],
      [41, 1, 9, 0, 1],
      [42, 1, 16, 1, 1],
      [43, 1, 14, 0, 3],
      [44, 1, 13, 0, 3],
      [45, 1, 3, 0, 1]
    ],
    description: "Dataset containing information on early termination from counseling for 45 clients, including symptom severity, gender, and wealth index.",
    pdfLink: "",
    spssLink: "https://drive.google.com/file/d/1o-nom7wX5ujRvuDX5yRjr-JSJwliUvNG/view?usp=drive_link"
  },
  codeSnippets: {
    python: ``,
    r: ``,
    cpp: ``
  }
};
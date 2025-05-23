import { Question } from '@/app/practical/types';

// Question 3 for 4th year, session2
export const question: Question = {
  id: 3,
  text: "4th year, session2: [YOUR QUESTION TEXT HERE]",
  colabLinks: {
    python: "https://colab.research.google.com/drive/your-python-link",
    r: "https://rstudio.cloud/project/your-r-link",
    cpp: "https://godbolt.org/your-cpp-link"
  },
  youTubeLink: {
    r: "",
    python: "https://youtu.be/bVP8AsD6KSY?si=mtHemEEE0XIXxZaK",
    cpp:"",
    spss: "https://youtu.be/HUeg53G8FVg?si=knA7TsXBR_4OQjhC",
    excel: "https://youtu.be/kLEX4nk5Nrk?si=oiuH-ffaZUGONSxH"
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
    python: `# Your Python code here
import numpy as np
import matplotlib.pyplot as plt

# Example code
data = [1, 2, 3, 4, 5]
print("Mean:", np.mean(data))
`,
    r: `# Your R code here
data <- c(1, 2, 3, 4, 5)
cat("Mean:", mean(data), "\n")
`,
    cpp: `// Your C++ code here
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    double mean = std::accumulate(data.begin(), data.end(), 0.0) / data.size();
    std::cout << "Mean: " << mean << std::endl;
    return 0;
}
`
  }
};
import { Question } from '@/app/practical/types';

// Question 2 for 1st year, session 1
export const question: Question = {
  id: 3,
  text: "1st Year, Session 1: Find the median of the following dataset: $Y = \\{7, 3, 5, 12, 9, 8, 11\\}$",
  colabLinks: {
    python: "https://colab.research.google.com/drive/1DOpDfqVIy9Bme4y7_ymjTD7fsGtFYOz5?usp=sharing",
    r: "https://rstudio.cloud/project/7654321",
    cpp: "https://godbolt.org/z/5MGT3jMnK"
  },
  youTubeLink: {
    r: "",
    python: "https://youtu.be/bVP8AsD6KSY?si=mtHemEEE0XIXxZaK",
    cpp:"",
    spss: "https://youtu.be/HUeg53G8FVg?si=knA7TsXBR_4OQjhC",
    excel: "https://youtu.be/kLEX4nk5Nrk?si=oiuH-ffaZUGONSxH"
  },
  dataset: {
    headers: ["Value"],
    rows: [
      [7],
      [3],
      [5],
      [12],
      [9],
      [8],
      [11]
    ],
    description: "An unsorted dataset for finding the median."
  },
  codeSnippets: {
    python: `import numpy as np

# Define the dataset
data = [7, 3, 5, 12, 9, 8, 11]

# Calculate median
median = np.median(data)

print(f"Dataset: {data}")
print(f"Median: {median}")`,
    r: `# Define the dataset
data <- c(7, 3, 5, 12, 9, 8, 11)

# Calculate median
median_val <- median(data)

cat("Dataset:", data, "\n")
cat("Median:", median_val)`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    // Define the dataset
    std::vector<int> data = {7, 3, 5, 12, 9, 8, 11};
    
    // Sort the data to find median
    std::vector<int> sorted_data = data;
    std::sort(sorted_data.begin(), sorted_data.end());
    
    // Calculate median
    double median;
    size_t n = sorted_data.size();
    if (n % 2 == 0) {
        // Even number of elements
        median = (sorted_data[n/2 - 1] + sorted_data[n/2]) / 2.0;
    } else {
        // Odd number of elements
        median = sorted_data[n/2];
    }
    
    // Print results
    std::cout << "Dataset: ";
    for(int value : data) {
        std::cout << value << " ";
    }
    std::cout << std::endl;
    std::cout << "Median: " << median << std::endl;
    
    return 0;
}`
  }
};

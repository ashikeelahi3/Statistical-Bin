import { Question } from '@/app/practical/types';

// Question 1 for 1st year, session 1
export const question: Question = {
  id: 1,
  text: "1st Year, Session 1: Calculate the mean and standard deviation of the given dataset: $X = \\{1, 2, 3, 4, 5\\}$",
  colabLinks: {
    python: "https://colab.research.google.com/drive/1DOpDfqVIy9Bme4y7_ymjTD7fsGtFYOz5?usp=sharing",
    r: "https://rstudio.cloud/project/1234567",
    cpp: "https://godbolt.org/z/4MGT3jMnK"
  },
  youTubeLink: {
    python: "",
    r: "",
    cpp: "",
    spss: ""
  },
  dataset: {
    headers: ["Value", "Squared", "Cubed"],
    rows: [
      [1, 1, 1],
      [2, 4, 8],
      [3, 9, 27],
      [4, 16, 64],
      [5, 25, 125]
    ],
    description: "A simple dataset showing values with their squares and cubes.",    externalLink: "https://docs.google.com/spreadsheets/d/1ev86hQoQ7dGVRi0CjCc363NMTpnhetkf/edit?usp=sharing&ouid=110098442984896070958&rtpof=true&sd=true",
    pdfLink: "https://drive.google.com/file/d/15Fu0xrUVZoMyxtPzy_c1WVRBgmv2MNuf/view?usp=sharing",
    spssLink: "https://drive.google.com/file/d/15Fu0xrUVZoMyxtPzy_c1WVRBgmv2MNuf/view?usp=sharing",
  },
  codeSnippets: {
    python: `import numpy as np

# Define the dataset
data = [1, 2, 3, 4, 5]

# Calculate mean and standard deviation
mean = np.mean(data)
std_dev = np.std(data)

print(f"Dataset: {data}")
print(f"Mean: {mean}")
print(f"Standard Deviation: {std_dev}")`,
    r: `# Define the dataset
data <- c(1, 2, 3, 4, 5)

# Calculate mean and standard deviation
mean_val <- mean(data)
std_dev <- sd(data)

cat("Dataset:", data, "\n")
cat("Mean:", mean_val, "\n")
cat("Standard Deviation:", std_dev)`,
    cpp: `#include <iostream>
#include <vector>
#include <cmath>

int main() {
    // Define the dataset
    std::vector<int> data = {1, 2, 3, 4, 5};
    
    // Calculate sum for mean
    double sum = 0;
    for(int value : data) {
        sum += value;
    }
    double mean = sum / data.size();
    
    // Calculate sum of squared differences for standard deviation
    double sum_squared_diff = 0;
    for(int value : data) {
        sum_squared_diff += std::pow(value - mean, 2);
    }
    double std_dev = std::sqrt(sum_squared_diff / data.size());
    
    // Print results
    std::cout << "Dataset: ";
    for(int value : data) {
        std::cout << value << " ";
    }
    std::cout << std::endl;
    std::cout << "Mean: " << mean << std::endl;
    std::cout << "Standard Deviation: " << std_dev << std::endl;
    
    return 0;
}`
  }
};

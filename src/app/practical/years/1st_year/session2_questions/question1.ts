import { Question } from '@/app/practical/types';

// Question 1 for 1st year, session 2
export const question: Question = {
  id: 1,
  text: "1st Year, Session 2: Calculate the sample correlation coefficient between variables X and Y given in the dataset.",
  colabLinks: {
    python: "https://colab.research.google.com/drive/1GQc-5fvfRM6uJgpSrK0VNfmrWEPhOXM8?usp=sharing",
    r: "https://rstudio.cloud/project/2468013",
    cpp: "https://godbolt.org/z/aWMGxzeK4"
  },
  youTubeLink: {
    r: "",
    python: "https://youtu.be/bVP8AsD6KSY?si=mtHemEEE0XIXxZaK",
    cpp:"",
    spss: "https://youtu.be/HUeg53G8FVg?si=knA7TsXBR_4OQjhC",
    excel: "https://youtu.be/kLEX4nk5Nrk?si=oiuH-ffaZUGONSxH"
  },
  dataset: {
    headers: ["X", "Y"],
    rows: [
      [2.5, 3.2],
      [3.7, 4.8],
      [5.1, 6.0],
      [4.3, 5.2],
      [3.8, 4.1],
      [2.9, 3.5]
    ],
    description: "Dataset for correlation analysis."
  },
  codeSnippets: {
    python: `import numpy as np
from scipy.stats import pearsonr
import matplotlib.pyplot as plt

# Data
X = [2.5, 3.7, 5.1, 4.3, 3.8, 2.9]
Y = [3.2, 4.8, 6.0, 5.2, 4.1, 3.5]

# Calculate correlation coefficient
corr, p_value = pearsonr(X, Y)

print(f"Correlation coefficient: {corr:.4f}")
print(f"P-value: {p_value:.4f}")

# Visualization
plt.figure(figsize=(8, 6))
plt.scatter(X, Y)
plt.title(f'Scatter plot with correlation coefficient: {corr:.4f}')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)

# Add regression line
z = np.polyfit(X, Y, 1)
p = np.poly1d(z)
plt.plot(X, p(X), "r--")

plt.show()`,
    r: `# Data
X <- c(2.5, 3.7, 5.1, 4.3, 3.8, 2.9)
Y <- c(3.2, 4.8, 6.0, 5.2, 4.1, 3.5)

# Calculate correlation coefficient
cor_value <- cor(X, Y)
cor_test <- cor.test(X, Y)

# Print results
cat("Correlation coefficient:", cor_value, "\n")
cat("P-value:", cor_test$p.value, "\n")

# Visualization
plot(X, Y, main = paste("Correlation coefficient:", round(cor_value, 4)),
     xlab = "X", ylab = "Y", pch = 19, col = "blue")
abline(lm(Y ~ X), col = "red", lty = 2)
grid()`,
    cpp: `#include <iostream>
#include <vector>
#include <cmath>

// Function to calculate correlation coefficient
double correlation(const std::vector<double>& X, const std::vector<double>& Y) {
    double sum_X = 0, sum_Y = 0, sum_XY = 0;
    double squareSum_X = 0, squareSum_Y = 0;
    
    int n = X.size();
    
    for (int i = 0; i < n; i++) {
        sum_X += X[i];
        sum_Y += Y[i];
        sum_XY += X[i] * Y[i];
        squareSum_X += X[i] * X[i];
        squareSum_Y += Y[i] * Y[i];
    }
    
    double corr = (n * sum_XY - sum_X * sum_Y) /
                  sqrt((n * squareSum_X - sum_X * sum_X) * 
                       (n * squareSum_Y - sum_Y * sum_Y));
    
    return corr;
}

int main() {
    std::vector<double> X = {2.5, 3.7, 5.1, 4.3, 3.8, 2.9};
    std::vector<double> Y = {3.2, 4.8, 6.0, 5.2, 4.1, 3.5};
    
    double corr = correlation(X, Y);
    
    std::cout << "Correlation coefficient: " << corr << std::endl;
    
    return 0;
}`
  }
};

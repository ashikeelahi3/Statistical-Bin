import { Question } from '@/app/practical/types';

// Question 4 for 1st year, session 1
export const question: Question = {
  id: 4,
  text: "1st Year, Session 1: Analyze the correlation between variables X and Y in the dataset and interpret the results.",
  colabLinks: {
    python: "https://colab.research.google.com/drive/example-correlation-python",
    r: "https://rstudio.cloud/project/example-correlation-r",
    cpp: "https://godbolt.org/example-correlation-cpp"
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
      [1.2, 2.4],
      [2.5, 3.8],
      [3.1, 4.2],
      [4.7, 6.1],
      [5.3, 7.5],
      [6.8, 8.9],
      [7.2, 9.6]
    ],
    description: "Dataset for correlation analysis between two variables."
  },
  codeSnippets: {
    python: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import pearsonr

# Sample data
X = [1.2, 2.5, 3.1, 4.7, 5.3, 6.8, 7.2]
Y = [2.4, 3.8, 4.2, 6.1, 7.5, 8.9, 9.6]

# Calculate Pearson correlation
corr, p_value = pearsonr(X, Y)

# Print results
print(f"Pearson correlation coefficient: {corr:.4f}")
print(f"P-value: {p_value:.4f}")

# Plotting
plt.figure(figsize=(8, 6))
plt.scatter(X, Y)
plt.xlabel('X')
plt.ylabel('Y')
plt.title(f'Correlation Analysis (r = {corr:.4f})')

# Add trendline
z = np.polyfit(X, Y, 1)
p = np.poly1d(z)
plt.plot(X, p(X), "r--")

plt.grid(True)
plt.show()`,
    r: `# Sample data
X <- c(1.2, 2.5, 3.1, 4.7, 5.3, 6.8, 7.2)
Y <- c(2.4, 3.8, 4.2, 6.1, 7.5, 8.9, 9.6)

# Calculate correlation
correlation <- cor(X, Y)
correlation_test <- cor.test(X, Y)

# Print results
cat("Pearson correlation coefficient:", correlation, "\n")
cat("P-value:", correlation_test$p.value, "\n")

# Plot the data with trendline
plot(X, Y, main = paste("Correlation Analysis (r =", round(correlation, 4), ")"),
     xlab = "X", ylab = "Y", pch = 19)
abline(lm(Y ~ X), col = "red", lty = 2)
grid()`,
    cpp: `#include <iostream>
#include <vector>
#include <cmath>
#include <numeric>

// Calculate Pearson correlation coefficient
double pearson_correlation(const std::vector<double>& X, const std::vector<double>& Y) {
    double sum_X = 0, sum_Y = 0, sum_XY = 0;
    double square_sum_X = 0, square_sum_Y = 0;
    
    for (size_t i = 0; i < X.size(); i++) {
        sum_X += X[i];
        sum_Y += Y[i];
        sum_XY += X[i] * Y[i];
        square_sum_X += X[i] * X[i];
        square_sum_Y += Y[i] * Y[i];
    }
    
    double n = X.size();
    double numerator = n * sum_XY - sum_X * sum_Y;
    double denominator = sqrt((n * square_sum_X - sum_X * sum_X) * 
                              (n * square_sum_Y - sum_Y * sum_Y));
    
    return numerator / denominator;
}

int main() {
    std::vector<double> X = {1.2, 2.5, 3.1, 4.7, 5.3, 6.8, 7.2};
    std::vector<double> Y = {2.4, 3.8, 4.2, 6.1, 7.5, 8.9, 9.6};
    
    double correlation = pearson_correlation(X, Y);
    
    std::cout << "Pearson correlation coefficient: " << correlation << std::endl;
    
    return 0;
}`
  }
};

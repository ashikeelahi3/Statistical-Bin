import { Question } from '@/app/practical/types';

// Question 2 for 1st year, session 2
export const question: Question = {
  id: 2,
  text: "1st Year, Session 2: Perform a t-test to determine if there is a significant difference between the means of two independent samples.",
  colabLinks: {
    python: "https://colab.research.google.com/drive/example-ttest-python",
    r: "https://rstudio.cloud/project/example-ttest-r",
    cpp: "https://godbolt.org/example-ttest-cpp"
  },
  dataset: {
    headers: ["Group A", "Group B"],
    rows: [
      [78, 85],
      [82, 87],
      [76, 82],
      [84, 90],
      [80, 86],
      [79, 83],
      [81, 89],
      [77, 84]
    ],
    description: "Two independent samples for t-test analysis."
  },
  codeSnippets: {
    python: `import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Sample data
group_a = [78, 82, 76, 84, 80, 79, 81, 77]
group_b = [85, 87, 82, 90, 86, 83, 89, 84]

# Perform t-test
t_stat, p_value = stats.ttest_ind(group_a, group_b)

# Print results
print(f"t-statistic: {t_stat:.4f}")
print(f"p-value: {p_value:.4f}")
print(f"Significance level (alpha): 0.05")
print(f"Result: {'Reject null hypothesis' if p_value < 0.05 else 'Fail to reject null hypothesis'}")

# Visualization
plt.figure(figsize=(10, 6))

# Box plot
plt.subplot(1, 2, 1)
plt.boxplot([group_a, group_b], labels=['Group A', 'Group B'])
plt.title('Box Plot Comparison')
plt.ylabel('Values')

# Histogram
plt.subplot(1, 2, 2)
plt.hist(group_a, alpha=0.5, label='Group A')
plt.hist(group_b, alpha=0.5, label='Group B')
plt.title('Histogram Comparison')
plt.xlabel('Values')
plt.ylabel('Frequency')
plt.legend()

plt.tight_layout()
plt.show()`,
    r: `# Sample data
group_a <- c(78, 82, 76, 84, 80, 79, 81, 77)
group_b <- c(85, 87, 82, 90, 86, 83, 89, 84)

# Perform t-test
t_test_result <- t.test(group_a, group_b)

# Print results
cat("t-statistic:", t_test_result$statistic, "\n")
cat("p-value:", t_test_result$p.value, "\n")
cat("Degrees of freedom:", t_test_result$parameter, "\n")
cat("95% confidence interval:", t_test_result$conf.int[1], "to", t_test_result$conf.int[2], "\n")
cat("Group A mean:", mean(group_a), "\n")
cat("Group B mean:", mean(group_b), "\n")
cat("Significance level (alpha): 0.05", "\n")
cat("Result:", ifelse(t_test_result$p.value < 0.05, "Reject null hypothesis", "Fail to reject null hypothesis"), "\n")

# Visualization
par(mfrow=c(1,2))

# Box plot
boxplot(list(group_a, group_b), names=c("Group A", "Group B"), 
        main="Box Plot Comparison", col=c("lightblue", "lightgreen"))

# Histogram
hist(group_a, col=rgb(0,0,1,0.5), xlim=c(min(c(group_a, group_b)), max(c(group_a, group_b))),
     main="Histogram Comparison", xlab="Values")
hist(group_b, col=rgb(1,0,0,0.5), add=TRUE)
legend("topright", c("Group A", "Group B"), 
       col=c(rgb(0,0,1,0.5), rgb(1,0,0,0.5)), lwd=10)`,
    cpp: `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <numeric>

// Function to calculate t-test for independent samples
void ttest_ind(const std::vector<double>& a, const std::vector<double>& b) {
    double mean_a = std::accumulate(a.begin(), a.end(), 0.0) / a.size();
    double mean_b = std::accumulate(b.begin(), b.end(), 0.0) / b.size();
    
    // Calculate variance for each group
    double var_a = 0.0, var_b = 0.0;
    for (double x : a) var_a += std::pow(x - mean_a, 2);
    for (double x : b) var_b += std::pow(x - mean_b, 2);
    var_a /= (a.size() - 1);
    var_b /= (b.size() - 1);
    
    // Calculate t-statistic
    double t_stat = (mean_a - mean_b) / 
                    std::sqrt((var_a / a.size()) + (var_b / b.size()));
    
    // Calculate degrees of freedom (approximation)
    double df = std::pow((var_a/a.size() + var_b/b.size()), 2) / 
               (std::pow(var_a/a.size(), 2)/(a.size()-1) + 
                std::pow(var_b/b.size(), 2)/(b.size()-1));
    
    std::cout << "t-statistic: " << t_stat << std::endl;
    std::cout << "Approximate degrees of freedom: " << df << std::endl;
    std::cout << "Group A mean: " << mean_a << std::endl;
    std::cout << "Group B mean: " << mean_b << std::endl;
    std::cout << "Note: To get the p-value, look up the t-statistic in a t-table" << std::endl;
    
    // Note: Computing p-value requires more complex code to implement the t-distribution
}

int main() {
    std::vector<double> group_a = {78, 82, 76, 84, 80, 79, 81, 77};
    std::vector<double> group_b = {85, 87, 82, 90, 86, 83, 89, 84};
    
    ttest_ind(group_a, group_b);
    
    return 0;
}`
  }
};

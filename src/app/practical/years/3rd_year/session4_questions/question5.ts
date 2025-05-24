import { Question } from '@/app/practical/types';

// Question 5 for 3rd year, session4
export const question: Question = {
  id: 5,
  text: "Find the least square and median square regression from the following dataset where fires (y) is dependent variable and years (x) is independent variable.",
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
    headers: ["Years (X)", "Fires (Y)"],
    rows: [
      [1976, 16694],
      [1977, 12271],
      [1978, 12904],
      [1979, 14036],
      [1980, 13874],
    ],
    description: "",
    pdfLink: "https://drive.google.com/file/d/19fiyyer0cw8KM2GRKn2y7n34mE-KAy43/view?usp=sharing",
    spssLink: ""
  },
  codeSnippets: {
    python: ``,
    r: `years <- 1976:1980
fires <- c(16694, 12271, 12904, 14036, 13874)
plot(years, fires, main="Plot the Data to check outlier", col="red")
plot(years, fires, main="LS Model Fit line", col = "red")
abline( lm ( fires ~ years ), col= 4)

n=5
p=1
h = ((n/2)+(p+1)/2) = 3 # of obs. Each group

## Create afunction to collect median squre of errors
med.er.sq <- function( x, y){
 new <- data.frame(y, x)
 model <- lm(y ~ x)
 errors <- y - predict(model, new)
 med.er.sqr <- median(errors^2)
return (med.er.sqr)
}

## medain Erros Squre calculation
e1 <- med.er.sq(years[c(1,2,3)], fires[c(1,2,3)]) ## 1.line
e2 <- med.er.sq(years[c(1,2,4)], fires[c(1,2,4)]) ## 2.line
e3 <- med.er.sq(years[c(1,2,5)], fires[c(1,2,5)]) ## 3.line
e4 <- med.er.sq(years[c(1,3,4)], fires[c(1,3,4)]) ## 4.line
e5 <- med.er.sq(years[c(1,3,5)], fires[c(1,3,5)]) ## 5.line
e6 <- med.er.sq(years[c(1,4,5)], fires[c(1,4,5)]) ## 6.line
e7 <- med.er.sq(years[c(2,3,4)], fires[c(2,3,4)]) ## 7.line
e8 <- med.er.sq(years[c(2,3,5)], fires[c(2,3,5)]) ## 8.line
e9 <- med.er.sq(years[c(2,4,5)], fires[c(2,4,5)]) ## 9.line
e10 <- med.er.sq(years[c(3,4,5)], fires[c(3,4,5)]) ##10.lines

## Find least median squre of errors
e <-c(e1, e2, e3, e4, e5, e6, e7, e8, e9, e10)
summary(e)

## Fitted LMS model
x <- years[c(2,3,5)]
y <- fires[c(2,3,5)]
lms.model <- lm(y ~ x)
lms.model
## Graph of LMS
plot(years, fires, main= "LMS model line")
abline(lms.model, col= "red")

`,
    cpp: ``
  }
};
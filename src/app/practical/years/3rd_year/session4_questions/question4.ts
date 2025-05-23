import { Question } from '@/app/practical/types';

// Question 4 for 3rd year, session4
export const question: Question = {
  id: 4,
  text: "<ol><li>Fit a linear regression model of Y on X.</li>    <li>Draw a scatter plot of X and Y to identify unusual observations.</li><li>Repeat analysis after changing the 9th Y value from 79.24 to 65.24.</li><li>Repeat analysis with additional modifications: 9th Y to 65.24, 22nd Y to 35.32, and 22nd X to 610.</li><li>Identify influential observations, high leverage points, and outliers.</li><li>Summarize findings and compare results across different model versions.</li></ol>",
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
    headers: ["Delivery time<br/><i>Minutes</i> (Y)", "Distance<br/><i>Feet</i> (X)"],
    rows: [
      [16.68, 560],
      [11.50, 220],
      [12.03, 340],
      [14.88, 80],
      [13.75, 150],
      [18.11, 330],
      [8.00, 110],
      [17.83, 210],
      [79.24, 1460],
      [21.50, 605],
      [40.33, 688],
      [21.00, 215],
      [13.50, 255],
      [19.75, 462],
      [24.00, 448],
      [29.00, 776],
      [15.35, 200],
      [19.00, 132],
      [9.50, 36],
      [35.10, 770],
      [17.90, 140],
      [52.32, 810],
      [18.75, 450],
      [19.83, 635],
      [10.75, 150]
    ],
    description: "The following table gives the amount of time required by the route driver in selling soft drinks:",
    pdfLink: "https://drive.google.com/file/d/1iIs5jFAmAtQKwZkWl0h37aNyRbmz6My7/view?usp=drive_link",
    spssLink: ""
  },
  codeSnippets: {
    python: ``,
    r: `y<-c( 16.68, 11.50, 12.03, 14.88, 13.75, 18.11, 8.00, 17.83, 79.24, 21.50, 40.33, 21.00, 13.50,
19.75, 24.00 ,29.00, 15.35, 19.00, 9.50, 35.10, 17.90, 52.32, 18.75 ,19.83, 10.75)
x<-c(560, 220, 340, 80, 150, 330, 110 , 210, 1460, 605, 688, 215, 255 , 462, 448, 776,
200, 132 , 36, 770, 140, 810 , 450, 635, 150)
##(i)
model<-lm(y~x);model
##(ii)
plot(x,y)
abline(model)
#######(iii)
###High leverage value
d=(x-mean(x))^2/(sum((x-mean(x))^2));d
n=length(x);n
hii=(1/n)+d
hii
######
h<-hat(x);h
###Cut-off Point#####
p=2
CP=2*(p/n);CP ### Twice the mean rule
############Identification###########
CP>hii
which(hii>CP)
#####outlier
r<-model$residuals;r
msr<-sum(r^2)/(n-p);msr
ar<-abs(r);ar
di<-ar/sqrt(msr);di ##Standardized residuals
out<-di[di>3];out
#or
ri<-ar/sqrt(msr*(1-h));ri ##Studentized residuals
out<-ri[ri>3];out
#### Influential Observation#####
cdi<-(h*ri^2)/(p*(1-h));cdi
IO<-cdi[cdi>1];IO
###
cooks.distance(model)
####
y.hat=4.96116+.04257*x
y.hat
ei=y-y.hat;ei
sl.<-c(1:25)
data2=data.frame(sl.,y,x,y.hat,ei,hii,di,ri,cdi);data2
View(data2)`,
    cpp: ``
  }
};
import React from 'react';
import { Chart } from 'react-google-charts';
import { erf } from 'mathjs';

function calculatePDF(x: number, mu: number, sigma: number): number {
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

function calculateCDF(x: number, mu: number, sigma: number): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

function generateData(mu: number, sigma: number): [string, string | number][] {
  const data: [string, string | number][] = [['x', 'PDF']];
  for (let x = mu - 4 * sigma; x <= mu + 4 * sigma; x += 0.1) {
    data.push([x.toFixed(1), calculatePDF(x, mu, sigma)]);
  }
  return data;
}

function Visualization({ mu, sigma, x }: { mu: number; sigma: number; x: number }) {
  const pdfValue = calculatePDF(x, mu, sigma);
  const cdfValue = calculateCDF(x, mu, sigma);
  const chartData = generateData(mu, sigma);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Normal Distribution Visualization</h2>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          hAxis: { title: 'x' },
          vAxis: { title: 'PDF' },
          legend: 'none',
        }}
      />
      <div>
        <p>PDF Value at x = {x}: {pdfValue.toFixed(4)}</p>
        <p>CDF Value at x = {x}: {cdfValue.toFixed(4)}</p>
      </div>
    </div>
  );
}

export default Visualization;

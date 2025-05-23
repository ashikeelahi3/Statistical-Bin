"use client"

import React from 'react';

interface DatasetDisplayProps {
  headers: string[];
  rows: (string | number)[][];
  description?: string;
}

const DatasetDisplay: React.FC<DatasetDisplayProps> = ({ headers, rows, description }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Dataset</h3>
      
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mb-2">{description}</p>
      )}
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[var(--card-bg)] border-b border-[var(--border-color)]">
                <th className="border border-[var(--border-color)] px-3 py-2 text-left text-xs sm:text-sm">#</th>
                {headers.map((header, index) => (
                  <th key={index} className="border border-[var(--border-color)] px-3 py-2 text-left text-xs sm:text-sm">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-[var(--background)]' : 'bg-[var(--card-bg)]'}>
                  <td className="border border-[var(--border-color)] px-3 py-2 text-left font-medium text-xs sm:text-sm">{rowIndex + 1}</td>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-[var(--border-color)] px-3 py-2 text-left text-xs sm:text-sm">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatasetDisplay;

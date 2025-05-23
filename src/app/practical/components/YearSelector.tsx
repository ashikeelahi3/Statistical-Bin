"use client"

import React from 'react';
import { YearData } from '../types';

interface YearSelectorProps {
  years: YearData[];
  selectedYearId: string;
  onSelectYear: (yearId: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ 
  years, 
  selectedYearId, 
  onSelectYear 
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {years.map((year) => (
        <button
          key={year.id}
          className={`px-4 py-2 rounded-lg text-base font-semibold border border-[var(--border-color)] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 ${
            selectedYearId === year.id
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-md'
              : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
          }`}
          onClick={() => onSelectYear(year.id)}
        >
          {year.name}
        </button>
      ))}
    </div>
  );
};

export default YearSelector;

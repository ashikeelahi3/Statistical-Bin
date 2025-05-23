"use client"
import React, { useState, useCallback, memo } from 'react';
import DistributionForm from "@/components/distribution/Form";
import Visualization from '@/components/distribution/Visualization';

// Memoize the Visualization component to prevent unnecessary re-renders
const MemoizedVisualization = memo(Visualization);

export default function Home() {
  // Start with default values instead of null
  const [formData, setFormData] = useState({ mu: 0, sigma: 1, x: 0 });

  // Memoize callback to prevent unnecessary re-renders
  const handleFormUpdate = useCallback((data: { mu: number; sigma: number; x: number }) => {
    setFormData(prevData => {
      // Only update if values actually changed
      if (
        prevData.mu !== data.mu || 
        prevData.sigma !== data.sigma || 
        prevData.x !== data.x
      ) {
        return data;
      }
      return prevData;
    });
  }, []);

  // Handle x value changes from the slider
  const handleXChange = useCallback((newX: number) => {
    setFormData(prev => ({
      ...prev,
      x: newX
    }));
  }, []);

  return (
    <div className="flex flex-col relative min-h-screen pb-16 bg-[var(--background)] text-[var(--text-primary)]">
      <div className="flex-1 w-full flex items-center justify-center overflow-y-auto p-4">
        <div className="w-full max-w-5xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded shadow">
          <MemoizedVisualization 
            {...formData} 
            onXChange={handleXChange}
          />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] border-t border-[var(--card-border)] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-3 z-10">
        <div className="max-w-5xl mx-auto">
          <DistributionForm onSubmit={handleFormUpdate} />
        </div>
      </div>
    </div>
  );
}

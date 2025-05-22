import React, { useCallback, useEffect, useRef } from 'react';

function DistributionForm({ onSubmit }: { onSubmit: (data: { mu: number; sigma: number; x: number }) => void }) {
  const [mu, setMu] = React.useState(0);
  const [sigma, setSigma] = React.useState(1);
  const [x, setX] = React.useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced update to prevent too many updates and reduce re-renders
  const debouncedSubmit = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onSubmit({ mu, sigma, x });
      debounceTimerRef.current = null;
    }, 100);
  }, [mu, sigma, x, onSubmit]);

  // Update values when they change with debouncing
  useEffect(() => {
    debouncedSubmit();
    
    // Clean up the timer
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedSubmit]);

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-lg shadow-md">
      <div className="flex items-center">
        <label htmlFor="mu" className="font-medium text-gray-700 text-sm md:text-base mr-1">μ:</label>
        <input
          type="number"
          id="mu"
          value={mu}
          onChange={(e) => setMu(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1 text-sm md:text-base w-16 md:w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="sigma" className="font-medium text-gray-700 text-sm md:text-base mr-1">σ:</label>
        <input
          type="number"
          id="sigma"
          value={sigma}
          onChange={(e) => setSigma(Number(e.target.value) || 0.1)} // Prevent 0 or negative values
          min="0.1"
          className="border border-gray-300 rounded-md p-1 text-sm md:text-base w-16 md:w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="x" className="font-medium text-gray-700 text-sm md:text-base mr-1">x:</label>
        <input
          type="number"
          id="x"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1 text-sm md:text-base w-16 md:w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export default DistributionForm;
import React, { useState } from 'react';

function DistributionForm({ onSubmit }: { onSubmit: (data: { mu: number; sigma: number; x: number }) => void }) {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [x, setX] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ mu, sigma, x });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-4 bg-gray-100 p-2 rounded-lg shadow-md"
    >
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
          onChange={(e) => setSigma(Number(e.target.value))}
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
      <button
        type="submit"
        className="bg-blue-600 text-white text-sm md:text-base py-1 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
}

export default DistributionForm;
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import Visualization from './Visualization';
import EnhancedVisualization from './EnhancedVisualization';

/**
 * A test component to verify dark mode compatibility with visualizations
 * Displays both visualization components with controls for parameters
 */
export default function DarkModeTest() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [x, setX] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we have access to the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Don't render UI elements dependent on theme until client-side
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading theme settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Visualization Dark Mode Test</h2>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-accent text-accent-foreground"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Standard Visualization</h3>
          <Visualization mu={mu} sigma={sigma} x={x} onXChange={setX} />
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Enhanced Visualization</h3>
          <EnhancedVisualization mu={mu} sigma={sigma} x={x} onXChange={setX} />
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="mu-control" className="block text-sm font-medium text-secondary mb-1">
              Mean (μ): {mu}
            </label>
            <input
              id="mu-control"
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={mu}
              onChange={(e) => setMu(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Mean value"
            />
          </div>
          
          <div>
            <label htmlFor="sigma-control" className="block text-sm font-medium text-secondary mb-1">
              Standard Deviation (σ): {sigma}
            </label>
            <input
              id="sigma-control"
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={sigma}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Standard deviation value"
            />
          </div>
          
          <div>
            <label htmlFor="x-control" className="block text-sm font-medium text-secondary mb-1">
              X Value: {x.toFixed(2)}
            </label>
            <input
              id="x-control"
              type="range"
              min={mu - 4 * sigma}
              max={mu + 4 * sigma}
              step="0.1"
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
              className="w-full"
              aria-label="X value"
            />
          </div>
        </div>
      </div>
      
      <div className="card bg-background">
        <div className="prose dark:prose-invert max-w-none">
          <h3>Testing Instructions</h3>
          <ol>
            <li>Use the button at the top to toggle between dark and light modes</li>
            <li>Check that all visualizations update colors properly</li>
            <li>Verify that tooltips and interactive elements work in both themes</li>
            <li>Ensure the text is legible in both light and dark modes</li>
            <li>Test that animations work smoothly during theme transitions</li>
          </ol>
          <p>
            <strong>Note:</strong> The x-axis range automatically updates based on the mean (μ) and 
            standard deviation (σ) to always show 4σ on both sides.
          </p>
        </div>
      </div>
    </div>
  );
}

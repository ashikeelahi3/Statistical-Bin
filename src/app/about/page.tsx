import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-0">
      <h1 className="text-3xl font-bold mb-6">About Statistical Bin</h1>
      
      <div className="max-w-none">
        <p className="mb-4">
          Statistical Bin is a web application designed to help users analyze and visualize statistical data.
          Our platform provides intuitive tools for data processing, statistical analysis, and generating meaningful insights.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
        <p className="mb-4">
          We aim to democratize statistical analysis by providing accessible tools that make complex 
          statistical operations straightforward for both experts and beginners.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Features</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Data upload and cleaning capabilities</li>
          <li>Descriptive statistics generation</li>
          <li>Interactive data visualization</li>
          <li>Statistical hypothesis testing</li>
          <li>Export options for reports and visualizations</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Get Started</h2>
        <p className="mb-4">
          Ready to explore your data? Head over to our main application and start analyzing your datasets today.
        </p>
        
        <div className="mt-6">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
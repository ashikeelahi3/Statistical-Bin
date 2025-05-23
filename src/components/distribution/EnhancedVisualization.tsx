import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as math from 'mathjs';
import * as d3 from 'd3';

/**
 * Calculate Probability Density Function (PDF) for a normal distribution
 * @param x - The x value to calculate PDF for
 * @param mu - Mean of the distribution
 * @param sigma - Standard deviation of the distribution
 * @returns The PDF value at point x
 */
function calculatePDF(x: number, mu: number, sigma: number): number {
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

/**
 * Calculate Cumulative Distribution Function (CDF) for a normal distribution
 * @param x - The x value to calculate CDF for
 * @param mu - Mean of the distribution
 * @param sigma - Standard deviation of the distribution
 * @returns The CDF value at point x
 */
function calculateCDF(x: number, mu: number, sigma: number): number {
  return 0.5 * (1 + math.erf((x - mu) / (sigma * Math.sqrt(2))));
}

/**
 * Interface for data points used in the visualization
 */
interface DataPoint {
  x: number;
  y: number;
}

/**
 * Generate points for plotting the normal distribution curve
 * @param mu - Mean of the distribution
 * @param sigma - Standard deviation of the distribution
 * @param pointCount - Number of points to generate (default: 100)
 * @returns Array of data points for the normal distribution curve
 */
function generatePoints(mu: number, sigma: number, pointCount: number = 100): DataPoint[] {
  const points: DataPoint[] = [];
  // Use 4 sigma range to capture most of the distribution (99.99%)
  const minX = mu - 4 * sigma;
  const maxX = mu + 4 * sigma;
  const step = (maxX - minX) / pointCount;
  
  for (let i = 0; i <= pointCount; i++) {
    const x = minX + i * step;
    points.push({
      x,
      y: calculatePDF(x, mu, sigma)
    });
  }
  
  return points;
}

/**
 * Custom hook to track theme changes and provide current theme class
 * Uses MutationObserver to detect changes to the document's class list
 */
function useThemeClass() {
  // Use an initial undefined state to indicate we need to check the theme on client
  const [themeClass, setThemeClass] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Immediately set the theme on mount
    const isDark = document.documentElement.classList.contains('dark');
    setThemeClass(isDark ? 'dark' : 'light');
    
    // Create observer for theme changes
    const observer = new MutationObserver(() => {
      const isDarkUpdated = document.documentElement.classList.contains('dark');
      setThemeClass(isDarkUpdated ? 'dark' : 'light');
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Return the current theme or a default based on media preference until hydration completes
  return themeClass || (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  return themeClass;
}

/**
 * Props interface for the Normal Distribution Chart component
 */
interface NormalDistributionChartProps {
  mu: number;
  sigma: number;
  x: number;
  width?: number;
  height?: number;
  onXChange?: (newX: number) => void;
}

/**
 * A D3.js visualization component for the normal distribution
 * Displays PDF curve, interactive markers, and statistics
 */
function NormalDistributionChart({ 
  mu, 
  sigma, 
  x,
  width = 800,
  height = 400,
  onXChange,
}: NormalDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Track theme changes to re-render chart with appropriate color scheme
  const themeClass = useThemeClass();
  
  /**
   * Helper function to get CSS variables with fallback values
   * Ensures visualization works with theme system
   */  const getThemeVariable = useCallback((name: string, fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    
    // If we're in dark mode but don't have the value yet, use appropriate dark mode fallbacks
    if (!value && themeClass === 'dark') {
      switch(name) {
        case '--card-bg': return '#18181b';
        case '--text-primary': return '#f3f4f6';
        case '--text-secondary': return '#a3a3a3';
        case '--accent': return '#60a5fa';
        case '--border-color': return '#333333';
        default: return fallback;
      }
    }
    
    return value || fallback;
  }, [themeClass]);
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Reset initialization state when theme changes to force re-render
    isInitializedRef.current = false;
    
    // Clean up any existing tooltips
    d3.select('body').selectAll('div.d3-tooltip').remove();
    
    // Get theme variables for consistent styling
    const colorBg = getThemeVariable('--card-bg', '#fff');
    const colorText = getThemeVariable('--text-primary', '#222');
    const colorSecondary = getThemeVariable('--text-secondary', '#666');
    const colorAccent = getThemeVariable('--accent', '#2563eb');
    const colorAccentFg = getThemeVariable('--accent-foreground', '#fff');
    const colorBorder = getThemeVariable('--border-color', '#e5e7eb');
    const colorGrid = getThemeVariable('--border-color', '#e5e7eb');
    const colorStatsBg = getThemeVariable('--background', '#fff');
    const colorStatsBorder = getThemeVariable('--border-color', '#e5e7eb');
    const colorShadow = '0 2px 8px rgba(0,0,0,0.08)';
    const colorPDF = colorAccent;
    const colorHandle = '#e41a1c'; // Use a consistent color for the handle regardless of theme
    const colorHandleStroke = colorBg;
    const colorArea = 'rgba(76, 175, 80, 0.18)';    // Use theme-aware tooltip colors
    const colorTooltipBg = themeClass === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.9)';
    const colorTooltipText = themeClass === 'dark' ? '#f3f4f6' : '#ffffff';

    // Generate data points for the distribution curve
    const points = generatePoints(mu, sigma);
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Calculate max Y value for scaling
    const maxY = d3.max(points, d => d.y) || 0;
    
    // Create scales for mapping data to visual dimensions
    const xScale = d3.scaleLinear()
      .domain([mu - 4 * sigma, mu + 4 * sigma])
      .range([0, innerWidth]);
      
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1]) // Add 10% padding at the top
      .range([innerHeight, 0]);
        // Create line generator for the PDF curve
    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis); // Use basis curve for smoother appearance
    
    // Select SVG and clear any existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Apply theme colors with smooth transition
    svg.style('background', colorBg)
       .style('transition', 'background-color 0.3s ease, color 0.3s ease');
    
    // Create main chart group with initial fade-in animation
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('aria-label', 'Normal distribution chart')
      .style('opacity', 0.95);
      
    g.transition()
      .duration(300)
      .style('opacity', 1);
      // Grid lines for better readability
    const gridLinesY = g.append('g')
      .attr('class', 'grid-lines')
      .attr('aria-hidden', 'true');
      
    gridLinesY.selectAll('line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', (d: number) => yScale(d))
      .attr('x2', innerWidth)
      .attr('y2', (d: number) => yScale(d))
      .attr('stroke', colorGrid)
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);
      // X Axis
    const xAxis = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxis.call(d3.axisBottom(xScale))
      .call((g: d3.Selection<SVGGElement, unknown, null, undefined>) => g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 35)
        .attr('fill', colorText)
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text('x'));
      // Y Axis
    const yAxis = g.append('g')
      .attr('class', 'y-axis');
      
    yAxis.call(d3.axisLeft(yScale))
      .call((g: d3.Selection<SVGGElement, unknown, null, undefined>) => g.append('text')
        .attr('x', -40)
        .attr('y', innerHeight / 2)
        .attr('fill', colorText)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90,-40,' + (innerHeight / 2) + ')')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text('Probability Density'));
    
    // PDF Line with animated drawing effect
    const path = g.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', colorPDF)
      .attr('stroke-width', 3)
      .attr('d', lineGenerator)
      .attr('aria-label', 'Probability density function curve');
    
    const pathLength = (path.node() as SVGPathElement).getTotalLength();
    path.attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
    
    // X marker line with animation
    const xPos = xScale(x);
    const yPos = yScale(calculatePDF(x, mu, sigma));
    
    g.append('line')
      .attr('x1', xPos)
      .attr('y1', innerHeight)
      .attr('x2', xPos)
      .attr('y2', innerHeight)
      .attr('stroke', colorHandle)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('aria-label', 'Vertical marker line at selected x value')
      .transition()
      .duration(300)
      .attr('y2', yPos);
    
    // Interactive handle for selecting x values
    const handleElement = g.append('circle')
      .attr('cx', xPos)
      .attr('cy', yPos)
      .attr('r', 0)
      .attr('fill', colorHandle)
      .attr('stroke', colorHandleStroke)
      .attr('stroke-width', 2)
      .attr('cursor', 'grab')
      .attr('class', 'handle')
      .attr('aria-label', 'Draggable handle to select x value');
    
    const handleTransition = handleElement.transition()
      .duration(300)
      .attr('r', 8)
      .on("end", setupDragHandling);
    
    // Chart Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', colorText)
      .text('Normal Distribution - Probability Density Function');
    
    // Left stats box with parameters
    const leftStatsBox = g.append('g')
      .attr('transform', `translate(10, 10)`)
      .attr('class', 'left-stats-box')
      .attr('aria-label', 'Distribution parameters');
    
    leftStatsBox.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', colorStatsBg)
      .attr('stroke', colorStatsBorder)
      .attr('stroke-width', 1.5)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))');
    
    leftStatsBox.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', colorAccent)
      .text('Parameters:');
    
    leftStatsBox.append('text')
      .attr('x', 15)
      .attr('y', 45)
      .attr('font-size', '12px')
      .attr('fill', colorText)
      .text(`μ: ${mu.toFixed(2)}`);
    
    leftStatsBox.append('text')
      .attr('x', 15)
      .attr('y', 65)
      .attr('font-size', '12px')
      .attr('fill', colorText)
      .text(`σ: ${sigma.toFixed(2)}`);
    
    // Right stats box with calculated values
    const rightStatsBox = g.append('g')
      .attr('transform', `translate(${innerWidth - 140}, 10)`)
      .attr('class', 'right-stats-box')
      .attr('aria-label', 'Distribution values at selected point');
    
    rightStatsBox.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', colorStatsBg)
      .attr('stroke', colorStatsBorder)
      .attr('stroke-width', 1.5)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))');
    
    rightStatsBox.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', colorAccent)
      .text('Values:');
    
    const pdfValueFormatted = calculatePDF(x, mu, sigma).toFixed(4);
    rightStatsBox.append('text')
      .attr('x', 15)
      .attr('y', 45)
      .attr('font-size', '12px')
      .attr('fill', colorText)
      .text(`PDF: ${pdfValueFormatted}`);
    
    const cdfValueFormatted = (calculateCDF(x, mu, sigma) * 100).toFixed(2) + '%';
    rightStatsBox.append('text')
      .attr('class', 'cdf-value')
      .attr('x', 15)
      .attr('y', 65)
      .attr('font-size', '12px')
      .attr('fill', colorText)
      .text(`CDF: ${cdfValueFormatted}`);
    
    // Area under curve visualization
    let areaPath = null;
    let xValueLabel = null;
    
    if (x !== undefined) {
      // Generate points for the area under the curve up to x
      const areaPoints: DataPoint[] = [];
      const minXValue = mu - 4 * sigma;
      const step = (x - minXValue) / 50;
      
      for (let i = 0; i <= 50; i++) {
        const currentX = minXValue + i * step;
        areaPoints.push({
          x: currentX,
          y: calculatePDF(currentX, mu, sigma)
        });
      }
      
      // Area generator
      const areaGenerator = d3.area<DataPoint>()
        .x(d => xScale(d.x))
        .y0(innerHeight)
        .y1(d => yScale(d.y))
        .curve(d3.curveBasis);
      
      // Add the area path with fade-in animation
      areaPath = g.append('path')
        .datum(areaPoints)
        .attr('fill', colorArea)
        .attr('d', areaGenerator)
        .attr('class', 'cdf-area')
        .attr('aria-label', 'Shaded area representing cumulative probability')
        .style('opacity', 0)
        .transition()
        .duration(400)
        .style('opacity', 1);
      
      // x value label
      const labelX = xScale(x);
      const labelY = innerHeight - 20;
      xValueLabel = g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('fill', colorAccent)
        .attr('font-weight', 'bold')
        .style('font-size', '14px')
        .attr('class', 'x-value-label')
        .text(`x: ${x.toFixed(2)}`);
    }
    
    // Tooltip for showing values on hover
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .attr('role', 'tooltip')
      .style('position', 'absolute')
      .style('background', colorTooltipBg)
      .style('color', colorTooltipText)
      .style('padding', '7px 12px')
      .style('border-radius', '7px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100)
      .style('box-shadow', colorShadow);
    
    /**
     * Update the chart when x value changes
     */
    const updateX = (newX: number) => {
      if (onXChange) {
        // Calculate new values
        const newPdfValue = calculatePDF(newX, mu, sigma).toFixed(4);
        const newCdfValue = calculateCDF(newX, mu, sigma);
        const formattedCdfValue = (newCdfValue * 100).toFixed(2) + '%';
        
        // Update the right stats box with new values
        rightStatsBox.select('text:nth-child(2)').text(`x: ${newX.toFixed(2)}`);
        rightStatsBox.select('text:nth-child(3)').text(`PDF: ${newPdfValue}`);
        rightStatsBox.select('text:nth-child(4)').text(`CDF: ${formattedCdfValue}`);
        
        // Update CDF area visualization
        g.select('.cdf-area').remove();
        
        const minXValue = mu - 4 * sigma;
        const step = (newX - minXValue) / 50;
        
        const areaPoints: DataPoint[] = [];
        for (let i = 0; i <= 50; i++) {
          const currentX = minXValue + i * step;
          areaPoints.push({
            x: currentX,
            y: calculatePDF(currentX, mu, sigma)
          });
        }
        
        const areaGenerator = d3.area<DataPoint>()
          .x(d => xScale(d.x))
          .y0(innerHeight)
          .y1(d => yScale(d.y))
          .curve(d3.curveBasis);
        
        g.append('path')
          .datum(areaPoints)
          .attr('fill', 'rgba(76, 175, 80, 0.3)')
          .attr('d', areaGenerator)
          .attr('class', 'cdf-area')
          .style('opacity', 1);
        
        // Update x-value label
        const labelX = xScale(newX);
        g.select('.x-value-label')
          .attr('x', labelX)
          .attr('y', innerHeight - 20)
          .text(`x: ${newX.toFixed(2)}`);
          
        // Call the provided callback
        onXChange(newX);
      }
    };    // Transparent overlay for mouse interactions
    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer')
      .attr('aria-label', 'Interactive area for selecting x values')
      .on('click', function(event: MouseEvent) {
        const [mouseX] = d3.pointer(event);
        const newX = xScale.invert(mouseX);
        updateX(newX);
      })
      .on('mousemove', function(event: MouseEvent) {
        const [mouseX] = d3.pointer(event);
        const xValue = xScale.invert(mouseX);
        const pdfValue = calculatePDF(xValue, mu, sigma);
        const cdfValue = calculateCDF(xValue, mu, sigma);
        
        // Show tooltip with current values
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .html(`
            <div style="font-weight: bold;">x: ${xValue.toFixed(2)}</div>
            <div>PDF: ${pdfValue.toFixed(4)}</div>
            <div>CDF: ${(cdfValue * 100).toFixed(2)}%</div>
          `);
        
        // Show vertical guide line
        g.selectAll('.hover-line').remove();
        g.append('line')
          .attr('class', 'hover-line')
          .attr('x1', mouseX)
          .attr('y1', 0)
          .attr('x2', mouseX)
          .attr('y2', innerHeight)
          .attr('stroke', '#aaa')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');
      })
      .on('mouseout', function() {
        // Hide tooltip and guide line when mouse leaves
        tooltip.style('opacity', 0);
        g.selectAll('.hover-line').remove();
      });
    
    /**
     * Set up drag handling for the interactive handle
     */
    function setupDragHandling() {
      // Manual drag implementation to avoid d3-drag issues
      let isDragging = false;
        // Add the event directly to the DOM element for better performance
      const handleNode = handleElement.node();
      if (handleNode) {
        handleNode.addEventListener("mousedown", function(event: MouseEvent) {
          // Prevent default to avoid text selection
          event.preventDefault();
          isDragging = true;
          d3.select(this).attr('fill', '#ff7043').attr('cursor', 'grabbing');
            const mousemove = (moveEvent: MouseEvent): void => {
            if (isDragging) {
              // Constrain mouse position to chart bounds
              const mouseX: number = Math.max(0, Math.min(innerWidth, d3.pointer(moveEvent, g.node())[0]));
              const newX: number = xScale.invert(mouseX);
              const newY: number = calculatePDF(newX, mu, sigma);
              
              // Update handle position
              handleElement
                .attr('cx', mouseX)
                .attr('cy', yScale(newY));
              
              // Update chart values
              updateX(newX);
            }
          }
          const mouseup = (): void => {
            if (isDragging) {
              isDragging = false;
              handleElement.attr('fill', '#e41a1c').attr('cursor', 'grab');
              
              // Remove event listeners when done dragging
              document.body.removeEventListener('mousemove', mousemove);
              document.body.removeEventListener('mouseup', mouseup);
            }
          }
          
          // Add listeners to body to capture mouse movements outside the element
          document.body.addEventListener('mousemove', mousemove);
          document.body.addEventListener('mouseup', mouseup);
        });
      }
    }
    
    isInitializedRef.current = true;
    
    // Cleanup function to remove tooltips when component unmounts
    return () => {
      d3.select('body').selectAll('div.d3-tooltip').remove();
    };
    
  }, [mu, sigma, x, width, height, onXChange, themeClass, getThemeVariable]);
  
  return (
    <div className="w-full overflow-hidden">
      <svg 
        ref={svgRef} 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Normal distribution visualization chart"
      />
    </div>
  );
}

/**
 * Props interface for the main Visualization component
 */
interface VisualizationProps {
  mu: number;
  sigma: number;
  x: number;
  onXChange?: (newX: number) => void;
}

/**
 * Main visualization component that wraps the D3.js chart with additional UI elements
 */
function Visualization({ 
  mu, 
  sigma, 
  x, 
  onXChange 
}: VisualizationProps) {
  // State for managing animation effect when parameters change
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoized calculations to prevent unnecessary recalculations
  const pdfValue = useMemo(() => calculatePDF(x, mu, sigma), [x, mu, sigma]);
  const cdfValue = useMemo(() => calculateCDF(x, mu, sigma), [x, mu, sigma]);
  
  // Track theme changes to update styling appropriately
  const themeClass = useThemeClass();

  // Handle animation effect when parameters change
  useEffect(() => {
    // Start animation
    setIsAnimating(true);
    
    // Clear any existing animation timer
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    
    // Set timer to end animation after 300ms
    animationTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      animationTimerRef.current = null;
    }, 300);
    
    // Cleanup function to clear timer when component unmounts or dependencies change
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [x, mu, sigma, themeClass]);

  // CSS classes for animation effect
  const animationClass = isAnimating ? 'opacity-80 scale-99' : 'opacity-100 scale-100';
  
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto bg-[var(--card-bg)] rounded-lg shadow-lg p-6 transition-all duration-300 text-[var(--text-primary)]">
      <div className="space-y-4">
        {/* Chart container with animation effect */}
        <div 
          className={`transition-all duration-300 ease-in-out transform ${animationClass} relative`}
          aria-label="Normal distribution visualization"
        >
          <NormalDistributionChart 
            mu={mu} 
            sigma={sigma} 
            x={x}
            onXChange={onXChange} 
          />
        </div>
        
        {/* Chart legend and interactive controls information */}
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-2">
          <span>{(mu - 3 * sigma).toFixed(1)}</span>
          <span className="text-sm font-medium">
            Click or drag the red dot to change x: 
            <b className="text-[var(--accent)] ml-1">{x.toFixed(2)}</b>
          </span>
          <span>{(mu + 3 * sigma).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default Visualization;

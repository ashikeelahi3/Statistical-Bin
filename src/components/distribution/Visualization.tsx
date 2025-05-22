import React, { useEffect, useRef, useState } from 'react';
import * as math from 'mathjs';
import * as d3 from 'd3';

function calculatePDF(x: number, mu: number, sigma: number): number {
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

function calculateCDF(x: number, mu: number, sigma: number): number {
  return 0.5 * (1 + math.erf((x - mu) / (sigma * Math.sqrt(2))));
}

interface DataPoint {
  x: number;
  y: number;
}

function generatePoints(mu: number, sigma: number, pointCount: number = 100): DataPoint[] {
  const points: DataPoint[] = [];
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

function NormalDistributionChart({ 
  mu, 
  sigma, 
  x,
  width = 800,
  height = 400,
  onXChange,
}: { 
  mu: number; 
  sigma: number; 
  x: number;
  width?: number;
  height?: number;
  onXChange?: (newX: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!svgRef.current) return;
    
    d3.select('body').selectAll('div.d3-tooltip').remove();
    
    const points = generatePoints(mu, sigma);
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const maxY = d3.max(points, d => d.y) || 0;
    
    const xScale = d3.scaleLinear()
      .domain([mu - 4 * sigma, mu + 4 * sigma])
      .range([0, innerWidth]);
      
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([innerHeight, 0]);
      
    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveBasis);
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .style('opacity', 0.8);
      
    g.transition()
      .duration(300)
      .style('opacity', 1);
    
    const gridLinesY = g.append('g')
      .attr('class', 'grid-lines');
      
    gridLinesY.selectAll('line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', d => yScale(d))
      .attr('x2', innerWidth)
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);
    
    const xAxis = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxis.call(d3.axisBottom(xScale))
      .call(g => g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 35)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('x'));
    
    const yAxis = g.append('g')
      .attr('class', 'y-axis');
      
    yAxis.call(d3.axisLeft(yScale))
      .call(g => g.append('text')
        .attr('x', -40)
        .attr('y', innerHeight / 2)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90,-40,' + (innerHeight / 2) + ')')
        .text('Probability Density'));
    
    const path = g.append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', '#4285F4')
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);
    
    const pathLength = (path.node() as SVGPathElement).getTotalLength();
    path.attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
    
    const xPos = xScale(x);
    const yPos = yScale(calculatePDF(x, mu, sigma));
    
    g.append('line')
      .attr('x1', xPos)
      .attr('y1', innerHeight)
      .attr('x2', xPos)
      .attr('y2', innerHeight)
      .attr('stroke', '#e41a1c')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .transition()
      .duration(300)
      .attr('y2', yPos);
      // Create handle separately and store a reference to both the element and its transition
    const handleElement = g.append('circle')
      .attr('cx', xPos)
      .attr('cy', yPos)
      .attr('r', 0)
      .attr('fill', '#e41a1c')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('cursor', 'grab')
      .attr('class', 'handle');
    
    // Apply transition and then use .on("end", ...) to add event handlers after transition completes
    const handleTransition = handleElement.transition()
      .duration(300)
      .attr('r', 8)
      .on("end", setupDragHandling);
        svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Normal Distribution - Probability Density Function');        // Add stats box at left side for distribution parameters
    const leftStatsBox = g.append('g')
      .attr('transform', `translate(10, 10)`)
      .attr('class', 'left-stats-box');
      
    // Background rectangle for left stats
    leftStatsBox.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('filter', 'drop-shadow(1px 1px 3px rgba(0,0,0,0.2))');
      
    // Add distribution parameters text
    leftStatsBox.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Parameters:');
      
    leftStatsBox.append('text')
      .attr('x', 15)
      .attr('y', 45)
      .attr('font-size', '12px')
      .text(`μ: ${mu.toFixed(2)}`);
      
    leftStatsBox.append('text')
      .attr('x', 15)
      .attr('y', 65)
      .attr('font-size', '12px')
      .text(`σ: ${sigma.toFixed(2)}`);

    // Add stats box at right side for PDF and CDF values
    const rightStatsBox = g.append('g')
      .attr('transform', `translate(${innerWidth - 140}, 10)`)
      .attr('class', 'right-stats-box');
      
    // Background rectangle for right stats
    rightStatsBox.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', 'rgba(255, 255, 255, 0.9)')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('filter', 'drop-shadow(1px 1px 3px rgba(0,0,0,0.2))');
      
    // Add values text
    rightStatsBox.append('text')
      .attr('x', 10)
      .attr('y', 25)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Values:');
      
    const pdfValueFormatted = calculatePDF(x, mu, sigma).toFixed(4);
    rightStatsBox.append('text')
      .attr('x', 15)
      .attr('y', 45)
      .attr('font-size', '12px')
      .text(`PDF: ${pdfValueFormatted}`);
      
    const cdfValueFormatted = (calculateCDF(x, mu, sigma) * 100).toFixed(2) + '%';
    rightStatsBox.append('text')
      .attr('class', 'cdf-value')
      .attr('x', 15)
      .attr('y', 65)
      .attr('font-size', '12px')
      .attr('fill', '#000000')
      .attr('font-weight', 'bold')
      .text(`CDF: ${cdfValueFormatted}`);// Create these elements once and update them
    let areaPath = null;
    let xValueLabel = null;

    if (x !== undefined) {
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
      
      const areaGenerator = d3.area<DataPoint>()
        .x(d => xScale(d.x))
        .y0(innerHeight)
        .y1(d => yScale(d.y))
        .curve(d3.curveBasis);
      
      areaPath = g.append('path')
        .datum(areaPoints)
        .attr('fill', 'rgba(76, 175, 80, 0.3)')
        .attr('d', areaGenerator)
        .attr('class', 'cdf-area')
        .style('opacity', 0)
        .transition()
        .duration(400)
        .style('opacity', 1);
      
      // Create just a label for x value
      const labelX = xScale(x);
      const labelY = innerHeight - 20;
      
      xValueLabel = g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000000')
        .attr('font-weight', 'bold')
        .text(`x: ${x.toFixed(2)}`)
        .style('font-size', '14px')
        .attr('class', 'x-value-label');
    }
    
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100);    const updateX = (newX: number) => {
      if (onXChange) {
        // Update stats box values when x changes
        const newPdfValue = calculatePDF(newX, mu, sigma).toFixed(4);
        const newCdfValue = calculateCDF(newX, mu, sigma);
        const formattedCdfValue = (newCdfValue * 100).toFixed(2) + '%';
        
        // Update the right stats box with new values
        rightStatsBox.select('text:nth-child(2)').text(`x: ${newX.toFixed(2)}`);
        rightStatsBox.select('text:nth-child(3)').text(`PDF: ${newPdfValue}`);
        rightStatsBox.select('text:nth-child(4)').text(`CDF: ${formattedCdfValue}`);
        
        // Update CDF area
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
          .style('opacity', 1);        // Update x-value label
        const labelX = xScale(newX);
        g.select('.x-value-label')
          .attr('x', labelX)
          .attr('y', innerHeight - 20)
          .text(`x: ${newX.toFixed(2)}`);
          
        onXChange(newX);
      }
    };

    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer')
      .on('click', function(event) {
        const [mouseX] = d3.pointer(event);
        const newX = xScale.invert(mouseX);
        updateX(newX);
      })
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const xValue = xScale.invert(mouseX);
        const pdfValue = calculatePDF(xValue, mu, sigma);
        const cdfValue = calculateCDF(xValue, mu, sigma);
        
        tooltip
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .html(`
            <div style="font-weight: bold;">x: ${xValue.toFixed(2)}</div>
            <div>PDF: ${pdfValue.toFixed(4)}</div>
            <div>CDF: ${(cdfValue * 100).toFixed(2)}%</div>
          `);
        
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
        tooltip.style('opacity', 0);
        g.selectAll('.hover-line').remove();      });
      // Define the function that will be called after the transition completes
    function setupDragHandling() {
      // Manual drag implementation to avoid d3-drag issues
      let isDragging = false;
      
      // Add the event directly to the DOM element to avoid D3 transition issues
      const handleNode = handleElement.node();
      if (handleNode) {
        handleNode.addEventListener("mousedown", function(event) {
          // Prevent default to avoid text selection
          event.preventDefault();
          isDragging = true;
          d3.select(this).attr('fill', '#ff7043').attr('cursor', 'grabbing');
          
          function mousemove(moveEvent: MouseEvent): void {
            if (isDragging) {
              const mouseX: number = Math.max(0, Math.min(innerWidth, d3.pointer(moveEvent, g.node())[0]));
              const newX: number = xScale.invert(mouseX);
              const newY: number = calculatePDF(newX, mu, sigma);
              
              // Use handleElement instead of handle
              handleElement
                .attr('cx', mouseX)
                .attr('cy', yScale(newY));
              
              updateX(newX);
            }
          }
        
          function mouseup() {
            if (isDragging) {
              isDragging = false;
              // Use handleElement instead of handle
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
    
    // Function is called by transition's end event above
    
    isInitializedRef.current = true;
    
    return () => {
      d3.select('body').selectAll('div.d3-tooltip').remove();
    };
    
  }, [mu, sigma, x, width, height, onXChange]);
  
  return (
    <div className="w-full overflow-hidden">
      <svg ref={svgRef} width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}

function Visualization({ 
  mu, 
  sigma, 
  x, 
  onXChange 
}: { 
  mu: number; 
  sigma: number; 
  x: number;
  onXChange?: (newX: number) => void;
}) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const pdfValue = React.useMemo(() => calculatePDF(x, mu, sigma), [x, mu, sigma]);
  const cdfValue = React.useMemo(() => calculateCDF(x, mu, sigma), [x, mu, sigma]);
  
  useEffect(() => {
    setIsAnimating(true);
    
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    
    animationTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      animationTimerRef.current = null;
    }, 300);
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [x, mu, sigma]);

  const animationClass = isAnimating ? 'opacity-80 scale-99' : 'opacity-100 scale-100';
  
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 transition-all duration-300">
            
      <div className="space-y-4">
        <div className={`transition-all duration-300 ease-in-out transform ${animationClass} relative`}>
          <NormalDistributionChart 
            mu={mu} 
            sigma={sigma} 
            x={x}
            onXChange={onXChange} 
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 px-2">
          <span>{(mu - 3 * sigma).toFixed(1)}</span>
          <span className="text-sm font-medium">Click or drag the red dot to change x: <b>{x.toFixed(2)}</b></span>
          <span>{(mu + 3 * sigma).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default Visualization;

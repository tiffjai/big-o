import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ComplexityAnimationProps {
  complexity: string;
}

export const ComplexityAnimation: React.FC<ComplexityAnimationProps> = ({ complexity }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3.scaleLinear()
      .domain([0, 10])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const line = d3.line<[number, number]>()
      .x(d => x(d[0]))
      .y(d => y(d[1]));

    let data: [number, number][] = [];

    switch (complexity) {
      case 'O(1)':
        data = [[0, 1], [10, 1]];
        break;
      case 'O(log n)':
        data = d3.range(0, 10, 0.1).map(n => [n, Math.log2(n + 1)]);
        break;
      case 'O(n)':
        data = d3.range(0, 10, 0.1).map(n => [n, n]);
        break;
      case 'O(n log n)':
        data = d3.range(0, 10, 0.1).map(n => [n, n * Math.log2(n + 1)]);
        break;
      case 'O(n^2)':
        data = d3.range(0, 10, 0.1).map(n => [n, n * n]);
        break;
    }

    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    const totalLength = path.node()?.getTotalLength() || 0;

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .attr("d", line)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

  }, [complexity]);

  return <svg ref={svgRef} width={300} height={200}></svg>;
};
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AlgorithmAnimationProps {
  algorithm: string;
}

export const AlgorithmAnimation: React.FC<AlgorithmAnimationProps> = ({ algorithm }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    switch (algorithm) {
      case 'binarySearch':
        animateBinarySearch(svg, width, height, margin);
        break;
      case 'hashTable':
        animateHashTable(svg, width, height, margin);
        break;
      case 'bubbleSort':
        animateBubbleSort(svg, width, height, margin);
        break;
      case 'mergeSort':
        animateMergeSort(svg, width, height, margin);
        break;
      case 'quickSort':
        animateQuickSort(svg, width, height, margin);
        break;
      case 'heapSort':
        animateHeapSort(svg, width, height, margin);
        break;
    }
  }, [algorithm]);

  return <svg ref={svgRef} width={400} height={300}></svg>;
};

function animateBinarySearch(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const data = Array.from({ length: 15 }, (_, i) => i * 2);
  const target = 18;

  const x = d3.scaleBand()
    .domain(data.map(String))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  function updateBars(low: number, high: number, mid: number) {
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(String(d)) || 0)
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d))
      .attr("fill", ( _ , i) => {
        if (i === mid) return "red";
        if (i >= low && i <= high) return "orange";
        return "steelblue";
      });
  }

  async function binarySearch(arr: number[], target: number) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      updateBars(low, high, mid);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (arr[mid] === target) return mid;
      if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
    }

    return -1;
  }

  binarySearch(data, target);
}

function animateHashTable(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const data = [
    { key: "apple", value: 5 },
    { key: "banana", value: 7 },
    { key: "cherry", value: 3 },
    { key: "date", value: 1 },
    { key: "elderberry", value: 2 }
  ];

  const buckets = 7;
  const bucketHeight = (height - margin.top - margin.bottom) / buckets;

  svg.append("g")
    .selectAll("line")
    .data(d3.range(buckets + 1))
    .join("line")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", (d) => margin.top + d * bucketHeight)
    .attr("y2", (d) => margin.top + d * bucketHeight)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  function hashFunction(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % buckets;
  }

  const g = svg.append("g");

  function updateHashTable() {
    const elements = g.selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${margin.left}, ${margin.top + hashFunction(d.key) * bucketHeight})`);

    elements.selectAll("text")
      .data((d) => [d])
      .join("text")
      .attr("x", 10)
      .attr("y", bucketHeight / 2)
      .attr("dy", "0.35em")
      .text((d) => `${d.key}: ${d.value}`);
  }

  updateHashTable();

  // Simulate inserting a new item
  setTimeout(() => {
    data.push({ key: "fig", value: 8 });
    updateHashTable();
  }, 2000);
}

function animateBubbleSort(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const data = [64, 34, 25, 12, 22, 11, 90];

  const x = d3.scaleBand()
    .domain(data.map(String))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  function updateBars(arr: number[], i: number, j: number) {
    svg.selectAll(".bar")
      .data(arr)
      .join("rect")
      .attr("class", "bar")
      .attr("x", ( _, index) => x(String(index)) || 0)
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d))
      .attr("fill", ( _, index) => {
        if (index === i || index === j) return "red";
        return "steelblue";
      });
  }

  async function bubbleSort(arr: number[]) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        updateBars(arr, j, j + 1);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          updateBars(arr, j, j + 1);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
  }

  bubbleSort(data);
}

function animateMergeSort(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const data = [38, 27, 43, 3, 9, 82, 10];
  const x = d3.scaleBand()
    .domain(data.map(String))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  function updateBars(arr: number[], highlightIndices: number[] = []) {
    svg.selectAll(".bar")
      .data(arr)
      .join("rect")
      .attr("class", "bar")
      .attr("x", ( _, i) => x(String(i)) || 0)
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d))
      .attr("fill", (_, i) => highlightIndices.includes(i) ? "red" : "steelblue");
  }

  updateBars(data);

  async function merge(arr: number[], left: number, mid: number, right: number) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
      updateBars(arr, [k - 1]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
      updateBars(arr, [k - 1]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
      updateBars(arr, [k - 1]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async function mergeSort(arr: number[], left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  }

  mergeSort(data, 0, data.length - 1);
}

function animateQuickSort(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const data = [38, 27, 43, 3, 9, 82, 10];
  const x = d3.scaleBand()
    .domain(data.map(String))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  function updateBars(arr: number[], highlightIndices: number[] = [], pivotIndex: number = -1) {
    svg.selectAll(".bar")
      .data(arr)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(String(i)) || 0)
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d))
      .attr("fill", (_, i) => {
        if (i === pivotIndex) return "yellow";
        if (highlightIndices.includes(i)) return "red";
        return "steelblue";
      });
  }

  updateBars(data);

  async function partition(arr: number[], low: number, high: number) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        updateBars(arr, [i, j], high);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    updateBars(arr, [i + 1, high], i + 1);
    await new Promise(resolve => setTimeout(resolve, 500));

    return i + 1;
  }

  async function quickSort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  }

  quickSort(data, 0, data.length - 1);
}

function animateHeapSort(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, width: number, height: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const data = [38, 27, 43, 3, 9, 82, 10];
  const x = d3.scaleBand()
    .domain(data.map(String))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  function updateBars(arr: number[], highlightIndices: number[] = []) {
    svg.selectAll(".bar")
      .data(arr)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => x(String(i)) || 0)
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - margin.bottom - y(d))
      .attr("fill", (_, i) => highlightIndices.includes(i) ? "red" : "steelblue");
  }

  updateBars(data);

  async function heapify(arr: number[], n: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      updateBars(arr, [i, largest]);
      await new Promise(resolve => setTimeout(resolve, 500));
      await heapify(arr, n, largest);
    }
  }

  async function heapSort(arr: number[]) {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      updateBars(arr, [0, i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      await heapify(arr, i, 0);
    }
  }

  heapSort(data);
}
export const complexityData = [
  { name: 'O(1)', color: '#2c3e50', title: 'Constant Time', description: 'The runtime is constant and does not change with the size of the input.', examples: ['Accessing an element in an array by index', 'Inserting or deleting an element in a hash table'] },
  { name: 'O(log n)', color: '#27ae60', title: 'Logarithmic Time', description: 'The runtime increases logarithmically as the input size increases.', examples: ['Binary search on a sorted array', 'Operations on balanced binary search trees'] },
  { name: 'O(n)', color: '#3498db', title: 'Linear Time', description: 'The runtime increases linearly with the size of the input.', examples: ['Finding the maximum or minimum element in an unsorted array', 'Checking if an element exists in an unsorted array'] },
  { name: 'O(n log n)', color: '#f39c12', title: 'Linearithmic Time', description: 'The runtime increases in a linearithmic manner, combining linear and logarithmic growth.', examples: ['Efficient sorting algorithms like Merge Sort, Quick Sort (average case), and Heap Sort', 'Constructing a binary search tree from a sorted array'] },
  { name: 'O(n^2)', color: '#e74c3c', title: 'Quadratic Time', description: 'The runtime increases quadratically with the size of the input.', examples: ['Simple sorting algorithms like Bubble Sort, Selection Sort, and Insertion Sort', 'Algorithms involving nested loops over the input'] },
];

export const generateChartData = (n: number) => {
  const data = [];
  for (let i = 1; i <= n; i++) {
    const point: { n: number } & Record<string, number> = { n: i };
    complexityData.forEach(complexity => {
      switch (complexity.name) {
        case 'O(1)': point[complexity.name] = 1; break;
        case 'O(log n)': point[complexity.name] = Math.log2(i); break;
        case 'O(n)': point[complexity.name] = i; break;
        case 'O(n log n)': point[complexity.name] = i * Math.log2(i); break;
        case 'O(n^2)': point[complexity.name] = i ** 2; break;
      }
    });
    data.push(point);
  }
  return data;
};
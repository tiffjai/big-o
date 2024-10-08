import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
 
import { Slider } from '@/components/ui/slider';
import { ComplexityChart } from './components/ComplexityChart';
import { ComplexityAnimation } from './components/ComplexityAnimation';
import { AlgorithmAnimation } from './components/AlgorithmAnimation';
import { complexityData, generateChartData } from './data/complexityData';
import { QuizSection } from './components/QuizSection';
import { timeComplexityQuestions, spaceComplexityQuestions } from './data/quizQuestions';

const App: React.FC = () => {
  const [selectedComplexity, setSelectedComplexity] = useState(complexityData[0].name);
  const [chartData, setChartData] = useState(generateChartData(20));
  const [dataSize, setDataSize] = useState(20);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  useEffect(() => {
    setChartData(generateChartData(dataSize));
  }, [dataSize]);

  const getAlgorithmsForComplexity = (complexity: string) => {
    switch (complexity) {
      case 'O(1)':
        return [{ name: 'hashTable', label: 'Hash Table' }];
      case 'O(log n)':
        return [{ name: 'binarySearch', label: 'Binary Search' }];
      case 'O(n log n)':
        return [
          { name: 'mergeSort', label: 'Merge Sort' },
          { name: 'quickSort', label: 'Quick Sort' },
          { name: 'heapSort', label: 'Heap Sort' }
        ];
      case 'O(n^2)':
        return [{ name: 'bubbleSort', label: 'Bubble Sort' }];
      default:
        return [];
    }
  };

  const getAlgorithmExplanation = (algorithm: string) => {
    switch (algorithm) {
      case 'hashTable':
        return "A hash table is like a super-fast dictionary. It uses a special function to instantly find where information is stored, making it very quick to look things up.";
      case 'binarySearch':
        return "Binary search is like guessing a number. You start in the middle and eliminate half the options each time, making it very efficient for finding things in sorted lists.";
      case 'mergeSort':
        return "Merge sort is like sorting a deck of cards by splitting it in half, sorting each half, and then combining them back together in order.";
      case 'quickSort':
        return "Quick sort picks a 'pivot' item and puts smaller items on one side and larger items on the other. It then sorts these smaller groups until everything is in order.";
      case 'heapSort':
        return "Heap sort organizes data into a special tree-like structure called a heap, then repeatedly removes the largest item to build the sorted list.";
      case 'bubbleSort':
        return "Bubble sort compares neighboring items and swaps them if they're in the wrong order. It's simple but not very efficient for large lists.";
      default:
        return "";
    }
  };

  return (
    <div className="bg-background min-h-screen p-8">
      <Card className="w-full max-w-6xl mx-auto bg-card shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-3xl font-bold text-center">Big O Notation 101</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="flex justify-center bg-muted mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="timeQuiz">Time Complexity Quiz</TabsTrigger>
              <TabsTrigger value="spaceQuiz">Space Complexity Quiz</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Complexity Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ComplexityChart data={chartData} />
                    <div className="mt-4">
                      <Label>Data Size: {dataSize}</Label>
                      <Slider
                        min={10}
                        max={100}
                        step={1}
                        value={[dataSize]}
                        onValueChange={(value) => setDataSize(value[0])}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Complexity Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedComplexity} onValueChange={(value) => {
                      setSelectedComplexity(value);
                      setSelectedAlgorithm('');
                    }} className="space-y-2">
                      {complexityData.map((complexity) => (
                        <div key={complexity.name} className="flex items-center space-x-2">
                          <RadioGroupItem value={complexity.name} id={complexity.name} />
                          <Label htmlFor={complexity.name}>{complexity.title}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {complexityData.map((complexity) => (
                      complexity.name === selectedComplexity && (
                        <div key={complexity.name} className="mt-4">
                          <h3 className="text-lg font-semibold">{complexity.title}</h3>
                          <p className="text-muted-foreground">{complexity.description}</p>
                          <h4 className="font-semibold mt-2">Examples:</h4>
                          <ul className="list-disc list-inside">
                            {complexity.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            <h4 className="font-semibold">Complexity Growth:</h4>
                            <ComplexityAnimation complexity={complexity.name} />
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold">Algorithm Examples:</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {getAlgorithmsForComplexity(complexity.name).map((algo) => (
                                <Button
                                  key={algo.name}
                                  variant={selectedAlgorithm === algo.name ? "default" : "outline"}
                                  onClick={() => setSelectedAlgorithm(algo.name)}
                                >
                                  {algo.label}
                                </Button>
                              ))}
                            </div>
                            {selectedAlgorithm && (
                              <div className="mt-4">
                                <p className="mb-2 text-muted-foreground">{getAlgorithmExplanation(selectedAlgorithm)}</p>
                                <AlgorithmAnimation algorithm={selectedAlgorithm} />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="timeQuiz">
              <QuizSection title="Time Complexity Quiz" questions={timeComplexityQuestions} />
            </TabsContent>
            
            <TabsContent value="spaceQuiz">
              <QuizSection title="Space Complexity Quiz" questions={spaceComplexityQuestions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
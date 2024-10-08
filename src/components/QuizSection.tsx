import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizSectionProps {
  title: string;
  questions: Question[];
}

export const QuizSection: React.FC<QuizSectionProps> = ({ title, questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentIndex];
    setIsCorrect(selectedAnswer === currentQuestion.correctAnswer);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setSelectedAnswer('');
    setShowResult(false);
  };

  return (
    <Card className="overflow-hidden rounded-lg shadow-md">
      <CardHeader className="bg-muted border-b border-border">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="font-semibold text-lg">Question {currentIndex + 1}:</p>
        <p className="whitespace-pre-wrap">{questions[currentIndex].question}</p>
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-2">
          {questions[currentIndex].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors duration-150">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {!showResult ? (
          <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-4">
            <Alert variant={isCorrect ? "default" : "destructive"}>
              <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
              <AlertDescription>
                The correct answer is: {questions[currentIndex].correctAnswer}
              </AlertDescription>
            </Alert>
            <Button onClick={handleNextQuestion} className="w-full">
              Next Question
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import ScreenerQuestion from '@/components/features/screener/ScreenerQuestion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const screenerQuestions = [
    { id: 'q1', text: 'Does your child look at something you are looking at?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q2', text: 'Does your child point to things to show you something interesting?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q3', text: 'Does your child seem overly sensitive to noise?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q4', text: 'Does your child engage in repetitive movements (e.g., hand-flapping, rocking)?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q5', text: 'Does your child respond when you call their name?', options: ['Usually', 'Sometimes', 'Rarely'] },
];

const ScreenerPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    const totalSteps = screenerQuestions.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    const currentQuestion = screenerQuestions[currentStep];

    const handleAnswerSelect = (option) => {
        setAnswers({ ...answers, [currentQuestion.id]: option });
        // Automatically move to next question after a short delay
        setTimeout(() => {
            if (currentStep < totalSteps - 1) {
                setCurrentStep(currentStep + 1);
            }
        }, 300);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        let score = 0;
        Object.values(answers).forEach(answer => {
            if (answer === 'Sometimes') score += 1;
            if (answer === 'Rarely') score += 2;
        });

        let riskLevel = 'Low';
        if (score > 6) riskLevel = 'High';
        else if (score > 3) riskLevel = 'Medium';

        navigate('/results', { state: { riskLevel, answers } });
    };

    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12">
            <Card className="w-full max-w-2xl">
                <div className="p-6">
                    <p className="text-sm font-medium text-muted-foreground">
                        Question {currentStep + 1} of {totalSteps}
                    </p>
                    <Progress value={progress} className="mt-2" />
                </div>

                <div className="px-6 min-h-[280px]">
                    <AnimatePresence mode="wait">
                        <ScreenerQuestion
                            key={currentQuestion.id}
                            question={currentQuestion}
                            currentAnswer={answers[currentQuestion.id]}
                            onAnswerSelect={handleAnswerSelect}
                        />
                    </AnimatePresence>
                </div>

                <CardFooter className="flex justify-between items-center">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    {currentStep === totalSteps - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!answers[currentQuestion.id]}
                        >
                            Submit & See Results
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={!answers[currentQuestion.id]}
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default ScreenerPage;
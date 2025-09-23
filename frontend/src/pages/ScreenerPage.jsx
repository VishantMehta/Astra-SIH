import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import ScreenerQuestion from '@/components/features/screener/ScreenerQuestion';
import VideoTest from '@/components/features/screener/VideoTest';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const screenerQuestions = [
    { id: 'q1', text: 'Does your child look at something you are looking at?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q2', text: 'Does your child point to things to show you something interesting?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q3', text: 'Does your child seem overly sensitive to noise?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q4', text: 'Does your child engage in repetitive movements (e.g., hand-flapping, rocking)?', options: ['Usually', 'Sometimes', 'Rarely'] },
    { id: 'q5', text: 'Does your child respond when you call their name?', options: ['Usually', 'Sometimes', 'Rarely'] },
];

const ScreenerPage = () => {
    const [step, setStep] = useState('questionnaire'); // 'questionnaire', 'video', 'analysis'
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    const totalSteps = screenerQuestions.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    const currentQuestion = screenerQuestions[currentStep];

    const handleAnswerSelect = (option) => {
        setAnswers({ ...answers, [currentQuestion.id]: option });
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

    const proceedToVideo = () => {
        setStep('video');
        // After a delay simulating the video test, proceed to submit
        setTimeout(() => {
            setStep('analysis');
            setTimeout(() => handleSubmit(), 2000); // Wait 2s on analysis screen then submit
        }, 5000); // Simulate a 5-second video test
    }

    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12">
            <Card className="w-full max-w-3xl">
                <AnimatePresence mode="wait">
                    {step === 'questionnaire' && (
                        <motion.div key="questionnaire">
                            <div className="p-6">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Part 1: Questionnaire - Question {currentStep + 1} of {totalSteps}
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
                                {currentStep < totalSteps - 1 ? (
                                    <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!answers[currentQuestion.id]}>
                                        Next <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={proceedToVideo} disabled={!answers[currentQuestion.id]}>
                                        Proceed to Video Test
                                    </Button>
                                )}
                            </CardFooter>
                        </motion.div>
                    )}

                    {step === 'video' && <motion.div key="video" className="p-6"><VideoTest /></motion.div>}

                    {step === 'analysis' && (
                        <motion.div key="analysis" className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                            <p className="text-2xl font-heading">Analyzing responses...</p>
                            <p className="text-muted-foreground mt-2">This will just take a moment.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default ScreenerPage;
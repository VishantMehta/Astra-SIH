import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

// For the hackathon, we'll use a mock set of questions.
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
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // --- Mock Analysis Logic ---
        // This is a simplified example. A real backend would be more complex.
        let score = 0;
        Object.values(answers).forEach(answer => {
            if (answer === 'Usually') score += 2;
            if (answer === 'Sometimes') score += 1;
        });

        let riskLevel = 'Low';
        if (score > 6) {
            riskLevel = 'High';
        } else if (score > 3) {
            riskLevel = 'Medium';
        }

        // Navigate to the results page with the data
        navigate('/results', { state: { riskLevel, answers } });
    }



    return (
        <div className="flex flex-col items-center">
            <Card className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div>
                    <p className="text-sm font-sans text-primary-text/60">Question {currentStep + 1} of {totalSteps}</p>
                    <div className="w-full bg-foreground mt-2 rounded-full h-2">
                        <motion.div
                            className="bg-accent h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="mt-8">
                    <h2 className="text-2xl font-heading">{currentQuestion.text}</h2>
                    <div className="mt-6 space-y-4">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(option)}
                                className={`
                  w-full p-4 text-left rounded-lg border transition-all
                  ${answers[currentQuestion.id] === option
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-background hover:bg-accent/10 border-foreground'}
                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center">
                    <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}>
                        Back
                    </Button>
                    {currentStep < totalSteps - 1 ? (
                        <Button variant="primary" onClick={handleNext} disabled={!answers[currentQuestion.id]}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleSubmit} disabled={!answers[currentQuestion.id]}>
                            Submit & See Results
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ScreenerPage;
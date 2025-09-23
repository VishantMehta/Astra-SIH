import { useLocation, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const ResultsPage = () => {
    const location = useLocation();
    const { riskLevel } = location.state || { riskLevel: 'Low' }; // Default to 'Low' if no state is passed

    const resultConfig = {
        Low: {
            title: 'Low Probability of ASD Traits',
            color: 'bg-green-500',
            description: 'Based on your answers, the observed behaviors show a low probability of being associated with Autism Spectrum Disorder. Continue to monitor your child\'s development and consult a pediatrician with any concerns.',
        },
        Medium: {
            title: 'Medium Probability of ASD Traits',
            color: 'bg-yellow-500',
            description: 'The behaviors reported suggest a medium probability of being associated with ASD. It is recommended to discuss these observations with a child development specialist for a more comprehensive evaluation.',
        },
        High: {
            title: 'High Probability of ASD Traits',
            color: 'bg-red-500',
            description: 'The behaviors reported show a high correlation with traits of ASD. We strongly recommend scheduling a consultation with a developmental pediatrician or a qualified specialist for a formal diagnostic evaluation.',
        },
    };

    const currentResult = resultConfig[riskLevel];

    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-2xl text-center">
                    <h1 className="text-3xl font-bold font-heading mb-4">Screening Results</h1>
                    <p className="text-primary-text/70 mb-8">
                        This is a preliminary screening and is <span className="font-bold">not a diagnosis</span>. It is intended to be a helpful guide for parents.
                    </p>

                    <div className={`p-6 rounded-lg ${currentResult.color}/20`}>
                        <div className={`w-16 h-16 mx-auto rounded-full ${currentResult.color} mb-4`}></div>
                        <h2 className={`text-2xl font-heading font-bold ${currentResult.color.replace('bg-', 'text-')}`}>
                            {currentResult.title}
                        </h2>
                        <p className="mt-4">{currentResult.description}</p>
                    </div>

                    <div className="mt-8 text-left">
                        <h3 className="text-xl font-heading font-bold">Recommended Next Steps</h3>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-primary-text/80">
                            <li>Share these results with your child's pediatrician.</li>
                            <li>Explore our curated list of articles and videos.</li>
                            <li>Connect with specialists and support groups in our Resource Hub.</li>
                        </ul>
                    </div>

                    <div className="mt-8">
                        <Link to="/resources"> {/* This route doesn't exist yet, but we're planning for it */}
                            <Button variant="primary" size="lg">
                                Explore Resource Hub
                            </Button>
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResultsPage;
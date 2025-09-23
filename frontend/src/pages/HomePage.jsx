import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Card from '../components/Card'; // <-- Make sure Card is imported

// --- Helper Icons for the features section ---
const ScreenerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" /></svg>;
const GymIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l-4 6h8l-4-6zM3 11h18M5 11v8h14v-8M12 3l-4 6h8l-4-6z" /></svg>;
const HubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" /><circle cx="12" cy="10" r="3" /><circle cx="12" cy="12" r="10" /></svg>;


// --- Animated Orbs from the Hero Section ---
const AnimatedOrbs = () => {
    // ... (The code for the orbs remains the same, no changes needed here)
    return (
        <div className="relative w-full h-full">
            <motion.div className="absolute w-32 h-32 bg-accent/30 rounded-full blur-2xl" animate={{ x: [0, 20, 0, -20, 0], y: [0, -20, 0, 20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-light/30 rounded-full blur-3xl" animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
            <motion.div className="absolute top-20 left-20 w-24 h-24 bg-white/20 rounded-full blur-xl" animate={{ x: [5, -5, 5], y: [5, -5, 5] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
        </div>
    );
};


const HomePage = () => {
    const features = [
        {
            icon: <ScreenerIcon />,
            title: 'Dynamic Developmental Screener',
            description: 'An AI-powered, non-diagnostic questionnaire to help parents identify early ASD traits responsibly and effectively.',
        },
        {
            icon: <GymIcon />,
            title: 'Neuro-Sensory Gym',
            description: 'A suite of playful, interactive games like Magic Canvas and Emotion Mirror, designed to build crucial cognitive skills.',
        },
        {
            icon: <HubIcon />,
            title: 'Verified Resource Hub',
            description: 'A curated and searchable directory connecting parents with verified therapists, NGOs, and support communities.',
        },
    ];

    return (
        // We use a React Fragment <> to wrap both sections
        <>
            {/* --- Hero Section --- */}
            <div className="grid md:grid-cols-2 gap-8 items-center min-h-[70vh]">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-5xl md:text-6xl font-bold font-heading leading-tight">Guiding Stars for <span className="text-accent">Neurodiverse Journeys</span>.</h1>
                    <p className="mt-6 text-lg text-primary-text/80">Astra provides modern, AI-powered tools for early screening and playful, therapeutic activities to support children with autism and their parents.</p>
                    <div className="mt-8 flex items-center gap-4">
                        <Link to="/dashboard"><Button variant="primary" size="lg">Open Dashboard</Button></Link>
                        <Link to="/screener">
                            <Button variant="secondary" size="lg">
                                Take Screener
                            </Button>
                        </Link>
                    </div>
                </motion.div>
                <motion.div className="hidden md:block relative h-96" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <AnimatedOrbs />
                </motion.div>
            </div>

            {/* --- Features Section --- */}
            <div className="py-24">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-4xl font-bold font-heading text-center">A Comprehensive Toolkit for Support</h2>
                    <p className="mt-4 text-lg text-primary-text/80 text-center max-w-3xl mx-auto">From preliminary assessment to skill-building and community connection, Astra provides end-to-end assistance.</p>
                </motion.div>

                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full">
                                <div className="text-accent mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold font-heading">{feature.title}</h3>
                                <p className="mt-2 text-primary-text/80">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
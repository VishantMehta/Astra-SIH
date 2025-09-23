import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { motion } from 'framer-motion';

// --- Helper Icons for the dashboard cards ---
const ScreenerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" /></svg>;
const GymIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l-4 6h8l-4-6zM3 11h18M5 11v8h14v-8M12 3l-4 6h8l-4-6z" /></svg>;
const HubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" /><circle cx="12" cy="10" r="3" /><circle cx="12" cy="12" r="10" /></svg>;
const RoutineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="m9 14 2 2 4-4" /></svg>;


const dashboardLinks = [
    { to: '/screener', icon: <ScreenerIcon />, title: 'Developmental Screener', description: 'Take the preliminary questionnaire.' },
    { to: '/gym/emotion-mirror', icon: <GymIcon />, title: 'Sensory Gym', description: 'Engage in playful, therapeutic activities.' },
    { to: '/resources', icon: <HubIcon />, title: 'Resource Hub', description: 'Find verified specialists and NGOs.' },
    { to: '#', icon: <RoutineIcon />, title: 'Routine Planner', description: 'Coming Soon: Organize daily tasks.' },
];

const DashboardPage = () => {
    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold font-heading">Welcome Back!</h1>
                <p className="mt-2 text-lg text-primary-text/70">Here's your control center for Astra.</p>
            </motion.div>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
                {dashboardLinks.map((link, index) => (
                    <motion.div
                        key={link.title}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Link to={link.to} className={`block h-full ${link.title === 'Routine Planner' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Card className="h-full flex flex-col justify-between">
                                <div>
                                    <div className="text-accent mb-4">{link.icon}</div>
                                    <h2 className="text-2xl font-bold font-heading">{link.title}</h2>
                                    <p className="mt-2 text-primary-text/80">{link.description}</p>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
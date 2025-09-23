import { motion } from 'framer-motion';
import WelcomeHeader from '@/components/features/dashboard/WelcomeHeader';
import StatCard from '@/components/features/dashboard/StatCard';
import ProgressChart from '@/components/features/dashboard/ProgressChart';
import SuggestedActivities from '@/components/features/dashboard/SuggestedActivities';
import { Activity, Check, Target } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const DashboardPage = () => {
    return (
        <div className="container py-8 md:py-12">
            <WelcomeHeader />
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="Screener Result"
                        value="Medium"
                        description="Last assessed on 20 Sep"
                        icon={<Target className="h-4 w-4 text-muted-foreground" />}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="Activities This Week"
                        value="27"
                        description="+3 from last week"
                        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="Completion Rate"
                        value="82%"
                        description="Your weekly average"
                        icon={<Check className="h-4 w-4 text-muted-foreground" />}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
                    <ProgressChart />
                </motion.div>
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
                    <SuggestedActivities />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
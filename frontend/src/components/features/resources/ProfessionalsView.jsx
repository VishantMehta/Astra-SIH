import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Stethoscope } from 'lucide-react';

const professionals = [
    { id: 2, name: 'Dr. Anjali Sharma', type: 'Therapist', location: 'Mohali', description: 'Specializes in behavioral therapy and speech development.', specialties: ['ABA Therapy', 'Speech Pathology'] },
    { id: 5, name: 'Dr. Rajeev Gupta', type: 'Therapist', location: 'Chandigarh', description: 'Occupational therapist with 15+ years of experience.', specialties: ['Sensory Integration', 'Motor Skills'] },
    { id: 7, name: 'Dr. Priya Singh', type: 'Doctor', location: 'Panchkula', description: 'Developmental pediatrician focusing on early diagnosis.', specialties: ['Pediatrics', 'Diagnosis'] },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const ProfessionalsView = ({ type }) => {
    const filteredList = professionals.filter(p => p.type === type);
    const Icon = type === 'Therapist' ? User : Stethoscope;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {filteredList.map(prof => (
                <motion.div key={prof.id} variants={itemVariants}>
                    <Card className="flex flex-col sm:flex-row">
                        <div className="p-6 flex flex-col items-center justify-center border-b sm:border-r sm:border-b-0">
                            <Icon className="h-10 w-10 text-primary mb-2" />
                            <h3 className="text-lg font-bold font-heading">{prof.name}</h3>
                            <p className="text-sm text-muted-foreground">{prof.location}</p>
                        </div>
                        <div className="p-6 flex-grow">
                            <CardDescription>{prof.description}</CardDescription>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {prof.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                            </div>
                        </div>
                        <div className="p-6 flex items-center">
                            <Button className="w-full sm:w-auto">View Profile</Button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProfessionalsView;
import { useState, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';

// Mock data for the Resource Hub
const mockResources = [
    { id: 1, name: 'Hope Autism Foundation', type: 'NGO', location: 'Chandigarh', description: 'Provides early intervention programs and family support services.' },
    { id: 2, name: 'Dr. Anjali Sharma', type: 'Therapist', location: 'Mohali', description: 'Specializes in behavioral therapy and speech development for children.' },
    { id: 3, name: 'Bright Steps School', type: 'Educator', location: 'Panchkula', description: 'A special education center focused on inclusive learning environments.' },
    { id: 4, name: 'Awaaz Foundation', type: 'NGO', location: 'Chandigarh', description: 'Community-based support and awareness programs for neurodiversity.' },
    { id: 5, name: 'Dr. Rajeev Gupta', type: 'Therapist', location: 'Chandigarh', description: 'Occupational therapist with 15+ years of experience in sensory integration.' },
    { id: 6, name: 'Pathways Learning', type: 'Educator', location: 'Zirakpur', description: 'Offers personalized educational plans for children with special needs.' },
];

const filterTypes = ['All', 'NGO', 'Therapist', 'Educator'];

const ResourceHubPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredResources = useMemo(() => {
        return mockResources.filter(resource => {
            const matchesFilter = activeFilter === 'All' || resource.type === activeFilter;
            const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.location.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [searchTerm, activeFilter]);

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold font-heading text-center">Verified Resource Hub</h1>
                <p className="mt-4 text-lg text-primary-text/80 text-center max-w-3xl mx-auto">
                    Find and connect with trusted specialists, NGOs, and educators in your area.
                </p>
            </motion.div>

            {/* Search and Filter Controls */}
            <Card className="my-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-background rounded-lg border-2 border-foreground focus:border-accent focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                        {filterTypes.map(type => (
                            <Button
                                key={type}
                                variant={activeFilter === type ? 'primary' : 'secondary'}
                                onClick={() => setActiveFilter(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Card className="h-full flex flex-col">
                                <div className="flex-grow">
                                    <span className="text-sm font-bold text-accent">{resource.type}</span>
                                    <h3 className="text-xl font-bold font-heading mt-2">{resource.name}</h3>
                                    <p className="text-sm text-primary-text/60">{resource.location}</p>
                                    <p className="mt-4 text-primary-text/80">{resource.description}</p>
                                </div>
                                <Button variant="secondary" className="mt-6 w-full">View Details</Button>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-primary-text/80">No resources found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default ResourceHubPage;
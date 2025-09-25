import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import FilterSidebar from '@/components/features/library/FilterSidebar';
import ResourceCard from '@/components/features/library/ResourceCard';

// Mock data for the library. This would come from your backend.
const allResources = [
    { id: 1, title: "Understanding Sensory Needs", type: "Article", description: "An in-depth look at sensory processing and practical tips for parents.", tags: ["Sensory Issues", "Toddler (1-3)"] },
    { id: 2, title: "Video Guide to PECS", type: "Video", description: "Learn the basics of the Picture Exchange Communication System.", tags: ["Communication", "Preschool (3-5)"] },
    { id: 3, title: "Creating Visual Schedules", type: "Guide", description: "A step-by-step guide to making visual schedules that reduce anxiety.", tags: ["Routine Management", "School-Age (6-12)"] },
    { id: 4, title: "Navigating Social Cues", type: "Article", description: "Strategies for helping your child understand common social interactions.", tags: ["Social Skills", "School-Age (6-12)"] },
    { id: 5, title: "Managing Meltdowns", type: "Video", description: "Expert advice on how to de-escalate and prevent sensory-related meltdowns.", tags: ["Sensory Issues", "Preschool (3-5)"] },
    { id: 6, title: "A Parent's Guide to IEPs", type: "Guide", description: "Everything you need to know about Individualized Education Programs.", tags: ["Routine Management", "School-Age (6-12)"] },
];

const ResourceLibraryPage = () => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        challenges: [],
        age: '',
    });

    const filteredResources = useMemo(() => {
        return allResources.filter(resource => {
            const searchMatch = resource.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || resource.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const challengeMatch = filters.challenges.length === 0 || filters.challenges.every(c => resource.tags.includes(c));
            const ageMatch = filters.age === '' || resource.tags.includes(filters.age);
            return searchMatch && challengeMatch && ageMatch;
        });
    }, [filters]);

    return (
        <div className="container py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-heading">Resource Library</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Find curated articles, guides, and videos to support you on your journey.
                </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <FilterSidebar filters={filters} setFilters={setFilters} />
                </div>
                <main className="lg:col-span-3">
                    {filteredResources.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredResources.map(resource => (
                                <motion.div key={resource.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <ResourceCard resource={resource} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl font-semibold">No resources found</p>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ResourceLibraryPage;
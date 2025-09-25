import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FilterSidebar from '@/components/features/library/FilterSidebar';
import ResourceCard from '@/components/features/library/ResourceCard';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api';

const ResourceLibraryPage = () => {
    const [resources, setResources] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        challenge: '',
        age: '',
        page: 1,
    });

    useEffect(() => {
        const fetchLibraryItems = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: filters.page,
                    limit: 6, // Show 6 items per page
                });
                if (filters.search) params.append('search', filters.search);
                if (filters.challenge) params.append('challenge', filters.challenge);
                if (filters.age) params.append('age', filters.age);

                const response = await apiClient.get(`/resources/library?${params.toString()}`);
                setResources(response.data.data);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error("Failed to fetch library items:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLibraryItems();
    }, [filters]); // Re-fetch whenever any filter changes

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

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
                    {loading ? (
                        <div className="text-center py-16">Loading resources...</div>
                    ) : resources.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 gap-6">
                                {resources.map(resource => (
                                    <motion.div key={resource.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                        <ResourceCard resource={resource} />
                                    </motion.div>
                                ))}
                            </div>
                            {/* Pagination Controls */}
                            <div className="mt-8 flex justify-center items-center gap-4">
                                <Button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm font-medium">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <Button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import PostCard from "@/components/features/forum/PostCard";
import CreatePostForm from "@/components/features/forum/CreatePostForm";
import { PlusCircle } from "lucide-react";

// Mock data for the forum
const mockPosts = [
    { id: 1, title: "Any advice for a child who is a picky eater?", author: "Anonymous Parent", timestamp: "2 hours ago", replies: 5, excerpt: "My 4-year-old has a very limited diet and I'm worried about their nutrition. We've tried everything we can think of...", tags: ["Sensory", "Advice"] },
    { id: 2, title: "Success story: Our first successful trip to the grocery store!", author: "Anonymous Parent", timestamp: "1 day ago", replies: 12, excerpt: "Just wanted to share a win! After using social stories and a visual schedule, we had our first meltdown-free trip to the store.", tags: ["Success Story", "Routine Management"] },
    { id: 3, title: "How do you handle IEP meetings at school?", author: "Anonymous Parent", timestamp: "3 days ago", replies: 8, excerpt: "We have our first IEP meeting coming up and I'm feeling really overwhelmed. What should I prepare? Any tips are appreciated.", tags: ["Schooling", "IEP"] },
];

const ForumPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-heading">Parent Forum</h1>
                    <p className="mt-2 text-lg text-muted-foreground">A safe space to connect and share experiences.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Post</DialogTitle>
                        </DialogHeader>
                        <CreatePostForm setOpen={setOpen} />
                    </DialogContent>
                </Dialog>
            </div>

            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-6"
            >
                {mockPosts.map(post => <PostCard key={post.id} post={post} />)}
            </motion.div>
        </div>
    );
};

export default ForumPage;
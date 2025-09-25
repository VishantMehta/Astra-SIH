import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

// Mock data for a single post and comments
const mockPost = { id: 1, title: "Any advice for a child who is a picky eater?", author: "Anonymous Parent", timestamp: "2 hours ago", content: "My 4-year-old has a very limited diet and I'm worried about their nutrition. We've tried everything we can think of... textures seem to be a big issue. Looking for any strategies that have worked for others.", comments: [{ author: "Anonymous Parent", timestamp: "1 hour ago", text: "We had the same issue! We started using a 'food exploration' mat where there's no pressure to eat, just to touch or smell. It took a while but slowly helped." }, { author: "Anonymous Parent", timestamp: "45 minutes ago", text: "Have you tried involving them in the cooking process? My son is more likely to try something if he helped make it." }] };

const PostDetailPage = () => {
    const { postId } = useParams(); // In a real app, you'd use this ID to fetch data

    return (
        <div className="container py-12">
            <Link to="/forum" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Forum
            </Link>

            {/* Original Post */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{mockPost.title}</CardTitle>
                    <CardDescription>Posted by {mockPost.author} • {mockPost.timestamp}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{mockPost.content}</p>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold font-heading mb-4">{mockPost.comments.length} Replies</h2>
                <div className="space-y-6">
                    {mockPost.comments.map((comment, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Avatar>
                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold">{comment.author} <span className="text-xs text-muted-foreground ml-2">{comment.timestamp}</span></p>
                                <p className="mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Comment Form */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Add Your Reply</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                        <Textarea placeholder="Share your thoughts..." className="min-h-[100px]" />
                        <Button>Submit Reply</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostDetailPage;
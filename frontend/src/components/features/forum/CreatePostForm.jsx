import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const CreatePostForm = ({ setOpen }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        //in a real app, we'll send this data to a backend
        alert("Post submitted! (This is a placeholder)");
        setOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="A clear and descriptive title" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Share your experience or ask a question..." className="min-h-[120px]" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="e.g., Sensory, Schooling, Advice" />
            </div>
            <Button type="submit" className="mt-2">Submit Post</Button>
        </form>
    );
};

export default CreatePostForm;
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BookHeart } from "lucide-react";

const StoryWeaverWidget = () => {
    // In a real app, this would trigger a GenAI API call
    const handleGenerate = (e) => {
        e.preventDefault();
        const situation = e.target.elements.situation.value;
        alert(`Generating a social story for: "${situation}"`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookHeart className="h-5 w-5 text-primary" />
                    Story Weaver (GenAI)
                </CardTitle>
                <CardDescription>
                    Create simple social stories to prepare your child for new situations.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerate}>
                <CardContent>
                    <Input name="situation" placeholder="E.g., Going to the dentist, first day of school..." />
                </CardContent>
                <CardFooter>
                    <Button type="submit">Generate Story</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default StoryWeaverWidget;
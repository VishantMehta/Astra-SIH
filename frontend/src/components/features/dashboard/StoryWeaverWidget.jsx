import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import StoryDisplay from "./StoryDisplay";
import { BookHeart, Loader2 } from "lucide-react";

const StoryWeaverWidget = () => {
    const [story, setStory] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [situation, setSituation] = useState("");

    // This function simulates the API call to the GenAI model
    const handleGenerate = (e) => {
        e.preventDefault();
        if (!situation) return;

        setIsGenerating(true);
        // Simulate a 2-second API call
        setTimeout(() => {
            // In a real app, the response from your backend would be used here
            const generatedStory = {
                situation: situation,
                steps: [
                    { text: "First, we will get ready to go. It is a new place.", illustration: "Child putting on shoes with a parent" },
                    { text: "Then, we will travel to the new place. It is an adventure.", illustration: "Car driving down a friendly-looking street" },
                    { text: "When we arrive, we can look around together.", illustration: "Parent and child looking at the new place from outside" },
                    { text: "It is okay to feel nervous, but we will do it together.", illustration: "Parent holding child's hand and smiling" },
                ]
            };
            setStory(generatedStory);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <Dialog open={!!story} onOpenChange={(isOpen) => !isOpen && setStory(null)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookHeart className="h-5 w-5 text-primary" />
                        Story Weaver (GenAI)
                    </CardTitle>
                    <CardDescription>
                        Create simple social stories to prepare for new situations.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleGenerate}>
                    <CardContent>
                        <Input
                            name="situation"
                            value={situation}
                            onChange={(e) => setSituation(e.target.value)}
                            placeholder="E.g., Going to a birthday party, getting a haircut..."
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isGenerating ? "Generating..." : "Generate Story"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <DialogContent className="max-w-2xl">
                {story && <StoryDisplay story={story} />}
            </DialogContent>
        </Dialog>
    );
};

export default StoryWeaverWidget;
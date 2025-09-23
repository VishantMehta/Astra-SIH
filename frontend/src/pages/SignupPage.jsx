import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const SignupPage = () => {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Join the Astra community to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Jamie Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full mt-2">Create Account</Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupPage;
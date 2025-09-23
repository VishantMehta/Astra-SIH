import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Submitted:', formData);
        alert('Login request sent! (Check console for data)');
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold font-heading text-center mb-2">Welcome Back</h1>
                <p className="text-center text-primary-text/70 mb-8">Sign in to your Astra account.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField label="Email Address" id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    <InputField label="Password" id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    <Button type="submit" variant="primary" size="lg" className="w-full">Login</Button>
                </form>

                <p className="text-center mt-6 text-sm text-primary-text/70">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-accent hover:underline">
                        Sign up
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;
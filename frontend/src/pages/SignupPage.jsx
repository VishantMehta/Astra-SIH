import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup Submitted:', formData);
        alert('Account creation request sent! (Check console for data)');
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold font-heading text-center mb-2">Create an Account</h1>
                <p className="text-center text-primary-text/70 mb-8">Join the Astra community.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField label="Full Name" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                    <InputField label="Email Address" id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    <InputField label="Password" id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                    <Button type="submit" variant="primary" size="lg" className="w-full">Create Account</Button>
                </form>

                <p className="text-center mt-6 text-sm text-primary-text/70">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-accent hover:underline">
                        Login here
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default SignupPage;
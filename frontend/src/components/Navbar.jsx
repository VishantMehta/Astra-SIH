import Button from './Button';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navLinks = [
        { name: 'Dashboard', href: '/dashboard' }, // <-- Update href
        { name: 'Resources', href: '/resources' }, // <-- Update href
        { name: 'Sensory Gym', href: '/gym/magic-canvas' },      // <-- Update href
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav
                className="
          flex items-center justify-between p-4 px-8
          bg-foreground/80 backdrop-blur-lg 
          border-b border-white/10
        "
            >
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold font-heading text-accent">
                    Astra
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        // Use Link for navigation links
                        <Link
                            key={link.name}
                            to={link.href}
                            className="font-sans text-primary-text/80 hover:text-accent transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div>
                    <Link to="/login">
                        <Button variant="secondary" size="sm">
                            Login
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
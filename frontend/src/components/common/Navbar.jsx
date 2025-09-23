import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { Menu, Zap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Screener', href: '/screener' },
    { name: 'Sensory Gym', href: '/gym' },
    { name: 'Resources', href: '/resources' },
];

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold font-heading">Astra</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="hidden md:block">
                        <Button asChild>
                            <Link to="/login">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="flex flex-col gap-6 pt-10">
                                    <Link to="/" className="flex items-center gap-2 mb-4">
                                        <Zap className="h-6 w-6 text-primary" />
                                        <span className="text-xl font-bold font-heading">Astra</span>
                                    </Link>
                                    {navLinks.map((link) => (
                                        <NavLink
                                            key={link.name}
                                            to={link.href}
                                            className={({ isActive }) =>
                                                `text-lg font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-foreground'
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    ))}
                                    <Button asChild className="mt-4">
                                        <Link to="/login">Get Started</Link>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
import clsx from 'clsx';

const Button = ({
    children,
    onClick,
    variant = 'primary', // 'primary' or 'secondary'
    size = 'md', // 'sm', 'md', or 'lg'
    className = '',
    ...props // Pass any other props like 'disabled'
}) => {
    // Base styles for all buttons
    const baseStyles = 'font-heading font-bold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';

    // Styles for different variants
    const variantStyles = {
        primary: 'bg-accent text-white hover:bg-accent-light shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
        secondary: 'bg-foreground text-primary-text hover:bg-opacity-80',
    };

    // Styles for different sizes
    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const buttonClasses = clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className // Allows for custom classes to be passed in
    );

    return (
        <button className={buttonClasses} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;
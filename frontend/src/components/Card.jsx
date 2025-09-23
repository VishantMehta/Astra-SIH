import clsx from 'clsx';

const Card = ({ children, className = '', ...props }) => {
    const cardClasses = clsx(
        'bg-foreground',
        'rounded-2xl', // A generous border radius
        'p-8',         // Default padding
        'shadow-lg',   // A soft shadow
        'transition-all duration-300 ease-in-out',
        'hover:shadow-xl hover:-translate-y-1', // The hover effect
        className      // Allows for custom classes
    );

    return (
        <div className={cardClasses} {...props}>
            {children}
        </div>
    );
};

export default Card;
const InputField = ({ label, id, type = 'text', placeholder, value, onChange, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-primary-text/80 mb-2">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full p-3 bg-background rounded-lg border-2 border-foreground focus:border-accent focus:outline-none transition-colors"
                {...props}
            />
        </div>
    );
};

export default InputField;
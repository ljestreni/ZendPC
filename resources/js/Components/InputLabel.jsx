export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-widest ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}

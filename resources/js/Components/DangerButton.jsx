export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-6 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl font-bold text-xs text-red-400 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

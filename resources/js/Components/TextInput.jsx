import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'input-field border-dark-border bg-dark-bg/50 shadow-inner focus:border-zend-500 focus:ring-zend-500/30 text-slate-200 transition-all duration-300 ' +
                className
            }
            ref={localRef}
        />
    );
});

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
                'rounded-md border-gray-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 dark:focus:border-emerald-500 focus:ring-indigo-500 dark:focus:ring-emerald-500/20 ' +
                className
            }
            ref={localRef}
        />
    );
});

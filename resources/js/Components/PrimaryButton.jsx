export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-gray-800 dark:bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 dark:hover:bg-emerald-600 focus:bg-gray-700 dark:focus:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:bg-gray-900 dark:active:bg-emerald-700 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

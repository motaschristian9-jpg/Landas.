import React from 'react';

export default function GoogleButton({ className = '', ...props }) {
    return (
        <a
            href={route('auth.google.redirect')}
            className={
                `inline-flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-semibold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150 active:scale-[0.98] ` +
                className
            }
            {...props}
        >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                />
                <path
                    fill="#34A853"
                    d="M16.04 18.013c-1.09.696-2.47 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067C3.186 21.35 7.283 24 12 24c3.117 0 5.934-1.118 8.034-3.04l-3.994-2.947Z"
                />
                <path
                    fill="#4285F4"
                    d="M19.832 20.96c2.02-1.926 3.253-4.72 3.253-7.96 0-.812-.073-1.624-.21-2.413H12v4.57h6.357c-.274 1.481-1.113 2.738-2.31 3.562l3.785 3.24Z"
                />
                <path
                    fill="#FBBC05"
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.795.137-1.557.368-2.268L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                />
            </svg>
            <span>Continue with Google</span>
        </a>
    );
}

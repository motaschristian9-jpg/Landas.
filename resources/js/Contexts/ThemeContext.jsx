import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, initialTheme = 'system' }) => {
    const [theme, setTheme] = useState(initialTheme);
    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        const root = window.document.documentElement;

        const updateTheme = () => {
            let newResolvedTheme = theme;

            if (theme === 'system') {
                newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            setResolvedTheme(newResolvedTheme);

            if (newResolvedTheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        updateTheme();

        // Listen for system theme changes if set to system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const listener = (e) => {
                const newResolved = e.matches ? 'dark' : 'light';
                setResolvedTheme(newResolved);
                if (newResolved === 'dark') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            };
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [theme]);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        
        // Sync with backend
        router.patch(route('profile.theme.update'), {
            theme: newTheme
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success feedback if needed
            }
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

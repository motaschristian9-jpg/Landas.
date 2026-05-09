import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const options = [
        {
            id: 'light',
            name: 'Light',
            description: 'Clean and bright for daytime focus.',
            icon: Sun,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/10',
            border: 'border-amber-200 dark:border-amber-800/30'
        },
        {
            id: 'dark',
            name: 'Dark Mode',
            description: 'Easy on the eyes for deep work.',
            icon: Moon,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/10',
            border: 'border-emerald-200 dark:border-emerald-800/30'
        },
        {
            id: 'system',
            name: 'System',
            description: 'Syncs with your device settings.',
            icon: Monitor,
            color: 'text-slate-500',
            bg: 'bg-slate-50 dark:bg-slate-800/20',
            border: 'border-slate-200 dark:border-slate-700/40'
        }
    ];

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Interface Theme</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Choose how the system looks to you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map((option) => {
                    const isActive = theme === option.id;
                    const Icon = option.icon;

                    return (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTheme(option.id)}
                            className={`relative flex flex-col items-start p-5 rounded-3xl border-2 text-left transition-all duration-300 ${
                                isActive 
                                    ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] z-10' 
                                    : 'border-transparent bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 shadow-none'
                            }`}
                        >
                            <div className={`p-3 rounded-2xl mb-4 ${option.bg} ${option.color}`}>
                                <Icon size={24} />
                            </div>

                            <div className="space-y-1">
                                <span className="block font-bold text-slate-900 dark:text-white">
                                    {option.name}
                                </span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {option.description}
                                </span>
                            </div>

                            {isActive && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-4 right-4 text-emerald-500"
                                >
                                    <CheckCircle2 size={20} fill="currentColor" className="text-white dark:text-slate-800" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
};

export default ThemeSwitcher;

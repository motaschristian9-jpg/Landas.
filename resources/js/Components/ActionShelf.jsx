import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import { Heart, Flame, CheckCircle, Calendar, ChevronRight, Trophy } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ActionShelf({ habits, heartsCount }) {
    const { post, processing } = useForm();

    const handleLog = (habitId) => {
        post(route('habits.log', habitId), {
            preserveScroll: true,
        });
    };

    const dueHabits = habits.filter(h => h.is_due);
    const sortedDueHabits = [...dueHabits].sort((a, b) => {
        if (a.is_completed === b.is_completed) return 0;
        return a.is_completed ? 1 : -1;
    });
    const displayHabits = sortedDueHabits.slice(0, 2);
    const restHabits = habits.filter(h => !h.is_due);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Daily Discipline</h2>
                    <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Pulse</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-emerald-500 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-4 py-2 rounded-[1.25rem] shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <Heart size={18} fill="currentColor" />
                    <span className="font-black text-lg leading-none dark:text-white">{heartsCount}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {displayHabits.map((habit) => (
                    <HabitCard 
                        key={habit.id} 
                        habit={habit} 
                        onComplete={() => handleLog(habit.id)}
                        processing={processing}
                    />
                ))}

                {/* Rest Day Habits */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

                    <div className="flex flex-wrap gap-2">
                        {restHabits.map(habit => (
                            <div key={habit.id} className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                {habit.title}
                            </div>
                        ))}
                    </div>
                </div>

                {habits.length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                        <p className="text-slate-300 dark:text-slate-600 font-bold italic text-sm">No habits active.</p>
                    </div>
                )}


            </div>
        </div>
    );
}

function HabitCard({ habit, onComplete, processing }) {
    const containerRef = useRef(null);
    const { resolvedTheme } = useTheme();
    const x = useMotionValue(0);
    const startColor = resolvedTheme === 'dark' ? '#020617' : '#f1f5f9'; // slate-950 vs slate-100
    const background = useTransform(x, [0, 200], [startColor, "#10b981"]);
    const opacity = useTransform(x, [0, 100], [1, 0]);
    const [isTriggered, setIsTriggered] = useState(false);
    const [constraints, setConstraints] = useState({ left: 0, right: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const trackWidth = containerRef.current.offsetWidth;
            const handleWidth = 64; // w-16
            const padding = 16; // p-2 is 8px * 2? No, p-2 is 0.5rem = 8px.
            setConstraints({ left: 0, right: trackWidth - handleWidth - 16 }); 
        }
    }, []);

    const handleDragEnd = () => {
        if (x.get() > constraints.right - 20 && !isTriggered) {
            setIsTriggered(true);
            onComplete();
        }
    };

    return (
        <motion.div
            layout
            className="p-8 md:p-6 rounded-[3rem] md:rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col space-y-8"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-colors ${
                        habit.is_completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500'
                    }`}>
                        {habit.is_completed ? <Trophy size={28} strokeWidth={2.5} /> : <Flame size={28} strokeWidth={2.5} />}
                    </div>
                    <div>
                        <h3 className="font-black text-xl tracking-tight leading-none mb-1 dark:text-white">{habit.title}</h3>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                                <Flame size={12} className={habit.is_completed ? 'text-emerald-500' : 'text-orange-500'} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                    {habit.streak} Day Streak
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="px-4 py-2 rounded-2xl flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50">
                    <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">{habit.total_logs}</span>
                </div>
            </div>

            {!habit.is_completed ? (
                <div className="relative">
                    <motion.div 
                        ref={containerRef}
                        style={{ background }}
                        className="h-20 w-full rounded-full relative overflow-hidden flex items-center p-2 shadow-inner border-2 border-slate-50 dark:border-slate-800"
                    >
                        <motion.div 
                            style={{ opacity }}
                            className="absolute inset-0 flex items-center justify-center pl-16 md:pl-0 font-black text-[9px] uppercase tracking-[0.15em] md:tracking-[0.4em] text-slate-400 dark:text-slate-500 pointer-events-none whitespace-nowrap"
                        >
                            {processing ? 'Saving...' : 'Slide to Discipline'}
                        </motion.div>

                        <motion.div
                            drag="x"
                            dragConstraints={constraints}
                            dragElastic={0.05}
                            style={{ x }}
                            onDragEnd={handleDragEnd}
                            className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-emerald-500 cursor-grab active:cursor-grabbing z-10 border border-slate-100 dark:border-slate-700"
                        >
                            <ChevronRight size={32} strokeWidth={3} />
                        </motion.div>
                    </motion.div>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl py-4 flex items-center justify-center space-x-3 border-2 border-emerald-100 dark:border-emerald-800/30"
                >
                    <CheckCircle size={20} strokeWidth={3} />
                    <span className="text-xs font-black uppercase tracking-widest">Mastered for Today</span>
                </motion.div>
            )}
        </motion.div>
    );
}

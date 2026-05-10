import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronRight, Compass } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function VisionHub({ goals }) {
    const [isDragging, setIsDragging] = useState(false);
    const [prevPage, setPrevPage] = useState(goals.current_page);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

    const navigate = (url) => {
        if (!url) return;
        
        // Determine direction based on current vs target page if possible
        // But Inertia URLs don't always make it easy to tell. 
        // We'll just assume next/prev based on the button clicked.
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (goals.current_page > prevPage) setDirection(1);
        else if (goals.current_page < prevPage) setDirection(-1);
        setPrevPage(goals.current_page);
    }, [goals.current_page]);

    const calculateProgress = (goal) => {
        if (!goal.milestones?.length) return 0;
        const completed = goal.milestones.filter(m => m.is_completed).length;
        return Math.round((completed / goal.milestones.length) * 100);
    };

    // Show in-progress ones first
    const sortedGoals = useMemo(() => {
        return [...goals.data].sort((a, b) => {
            const aProg = calculateProgress(a);
            const bProg = calculateProgress(b);
            if (aProg === 100 && bProg !== 100) return 1;
            if (aProg !== 100 && bProg === 100) return -1;
            return 0;
        });
    }, [goals.data]);

    const variants = {
        enter: (dir) => ({
            x: dir > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (dir) => ({
            x: dir > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-[2px] bg-emerald-500 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Pillar Three</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Vision Roadmap</h2>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">Your high-level trajectory.</p>
                </div>
                <Link href={route('mastery.index')} className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-500 transition-all active:scale-95">
                    <Compass size={24} strokeWidth={2.5} />
                </Link>
            </div>

            {goals.data.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-sm">
                        <Target size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-slate-700 dark:text-slate-200 text-lg mb-1">No Visions Defined</h3>
                    <p className="text-slate-400 font-bold text-xs mb-6 max-w-[200px] mx-auto">Start engineering your future in the Mastery Hub.</p>
                    <Link href={route('mastery.index')} className="inline-block bg-slate-900 dark:bg-emerald-500 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200 dark:shadow-none active:scale-95">
                        Launch Vision
                    </Link>
                </div>
            ) : (
                <div className="relative">
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div 
                                key={goals.current_page}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-4 px-1"
                            >
                                {sortedGoals.map((goal, idx) => {
                                    const progress = calculateProgress(goal);
                                    return (
                                        <Link 
                                            key={goal.id} 
                                            href={route('mastery.index')} 
                                            className="block group h-full"
                                        >
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 border-2 border-transparent group-hover:border-emerald-100 dark:group-hover:border-emerald-500/30 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all shadow-sm group-hover:shadow-lg dark:group-hover:shadow-none h-full flex flex-col">
                                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors shadow-sm dark:shadow-none">
                                                        <Target size={18} md:size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <span className={`text-[10px] md:text-sm font-black ${progress === 100 ? 'text-emerald-500' : 'text-slate-400'}`}>{progress}%</span>
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <h3 className="font-black text-xs md:text-base text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-2 mb-1 md:mb-2">{goal.title}</h3>
                                                    <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {goal.milestones?.filter(m => m.is_completed).length || 0} / {goal.milestones?.length || 0} Steps
                                                    </p>
                                                </div>

                                                <div className="w-full h-1.5 md:h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden mt-4 md:mt-6">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {/* Fill empty slots to keep grid stable if < 4 goals */}
                                {sortedGoals.length < 4 && Array.from({ length: 4 - sortedGoals.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="hidden md:block opacity-0 h-full"></div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination Navigation */}
                    <div className="flex items-center justify-center space-x-6 mt-6">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setDirection(-1);
                                navigate(goals.prev_page_url);
                            }}
                            disabled={!goals.prev_page_url}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                                goals.prev_page_url 
                                ? 'border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-500' 
                                : 'border-slate-50 dark:border-slate-900 text-slate-200 dark:text-slate-800 cursor-not-allowed opacity-50'
                            }`}
                        >
                            <ChevronRight size={20} className="rotate-180" />
                        </motion.button>

                        <div className="flex items-center space-x-2">
                            {[...Array(goals.last_page)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        goals.current_page === i + 1 ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                                    }`}
                                />
                            ))}
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setDirection(1);
                                navigate(goals.next_page_url);
                            }}
                            disabled={!goals.next_page_url}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                                goals.next_page_url 
                                ? 'border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-500' 
                                : 'border-slate-50 dark:border-slate-900 text-slate-200 dark:text-slate-800 cursor-not-allowed opacity-50'
                            }`}
                        >
                            <ChevronRight size={20} />
                        </motion.button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
                        <Link href={route('mastery.index')} className="inline-flex items-center space-x-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors">
                            <span>Manage Mastery Hub</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

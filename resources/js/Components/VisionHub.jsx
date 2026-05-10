import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronRight, Compass, Trophy } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function VisionHub({ goals }) {
    const [prevPage, setPrevPage] = useState(goals.current_page);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

    const navigate = (url) => {
        if (!url) return;
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

    const sortedGoals = useMemo(() => {
        return [...goals.data].sort((a, b) => {
            const aProg = calculateProgress(a);
            const bProg = calculateProgress(b);
            if (aProg === 100 && bProg !== 100) return 1;
            if (aProg !== 100 && bProg === 100) return -1;
            return 0;
        });
    }, [goals.data]);

    return (
        <div className="space-y-6">
            {/* Header - Aligned with ActionShelf and TaskShelf */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Vision Roadmap</h2>
                    <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Pillar Three</span>
                    </div>
                </div>
                <Link
                    href={route("mastery.index")}
                    className="bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-emerald-500 uppercase tracking-widest px-4 py-2 rounded-xl flex items-center transition-all group active:scale-95"
                >
                    Expand{" "}
                    <ChevronRight
                        size={12}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            </div>

            <div className="space-y-3">
                {goals.data.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem]">
                        <p className="text-slate-300 dark:text-slate-600 font-bold italic text-sm">
                            No visions defined. Engineer your future.
                        </p>
                    </div>
                ) : (
                    <>
                        <AnimatePresence mode="popLayout">
                            {sortedGoals.map((goal) => {
                                const progress = calculateProgress(goal);
                                return (
                                    <motion.div
                                        key={goal.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-6 rounded-[2.2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-200 dark:hover:border-emerald-500/30 shadow-sm hover:shadow-xl hover:shadow-slate-100/30 dark:hover:shadow-none group"
                                    >
                                        <Link href={route('mastery.index')} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                                    progress === 100 ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'
                                                }`}>
                                                    {progress === 100 ? <Trophy size={20} strokeWidth={2.5} /> : <Target size={20} strokeWidth={2.5} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-base text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">{goal.title}</h3>
                                                    <div className="flex items-center mt-1 space-x-3">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                            {goal.milestones?.filter(m => m.is_completed).length || 0} / {goal.milestones?.length || 0} Milestones
                                                        </span>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${progress === 100 ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                            {progress}% Ready
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="hidden md:block w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Simplified Pagination Footer */}
                        {goals.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-4 pt-4">
                                <button 
                                    onClick={() => navigate(goals.prev_page_url)}
                                    disabled={!goals.prev_page_url}
                                    className={`p-2 rounded-xl border-2 transition-all ${
                                        goals.prev_page_url 
                                        ? 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-500' 
                                        : 'opacity-20 cursor-not-allowed'
                                    }`}
                                >
                                    <ChevronRight size={18} className="rotate-180" />
                                </button>

                                <div className="flex items-center space-x-1.5">
                                    {[...Array(goals.last_page)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-1 rounded-full transition-all duration-500 ${
                                                goals.current_page === i + 1 ? 'w-4 bg-emerald-500' : 'w-1 bg-slate-200 dark:bg-slate-800'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <button 
                                    onClick={() => navigate(goals.next_page_url)}
                                    disabled={!goals.next_page_url}
                                    className={`p-2 rounded-xl border-2 transition-all ${
                                        goals.next_page_url 
                                        ? 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-500' 
                                        : 'opacity-20 cursor-not-allowed'
                                    }`}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

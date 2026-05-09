import React from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight, Compass } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function VisionHub({ goals, nextUrl, onLoadMore }) {
    const calculateProgress = (goal) => {
        if (!goal.milestones?.length) return 0;
        const completed = goal.milestones.filter(m => m.is_completed).length;
        return Math.round((completed / goal.milestones.length) * 100);
    };

    // Show up to 3 goals (prioritize in-progress ones)
    const activeGoals = goals.sort((a, b) => {
        const aProg = calculateProgress(a);
        const bProg = calculateProgress(b);
        // Put completed goals at the bottom
        if (aProg === 100 && bProg !== 100) return 1;
        if (aProg !== 100 && bProg === 100) return -1;
        return 0;
    });

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

            {goals.length === 0 ? (
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
                <div className="space-y-4">
                    {activeGoals.map((goal, idx) => {
                        const progress = calculateProgress(goal);
                        return (
                            <Link key={goal.id} href={route('mastery.index')} className="block group">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-5 border-2 border-transparent group-hover:border-emerald-100 dark:group-hover:border-emerald-500/30 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all shadow-sm group-hover:shadow-lg dark:group-hover:shadow-none">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors shadow-sm dark:shadow-none">
                                                <Target size={20} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">{goal.title}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                    {goal.milestones?.filter(m => m.is_completed).length || 0} / {goal.milestones?.length || 0} Steps
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-black ${progress === 100 ? 'text-emerald-500' : 'text-slate-400'}`}>{progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-emerald-500 rounded-full"
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {nextUrl && (
                        <div className="pt-2">
                            <button 
                                onClick={onLoadMore}
                                className="w-full py-4 flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all"
                            >
                                Load More Visions
                            </button>
                        </div>
                    )}

                    <div className="pt-6 pb-2 text-center">
                        <Link href={route('mastery.index')} className="inline-flex items-center space-x-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors">
                            <span>Open Mastery Hub</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

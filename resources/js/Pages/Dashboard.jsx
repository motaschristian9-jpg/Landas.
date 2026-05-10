import { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import ActionShelf from '@/Components/ActionShelf';
import VisionHub from '@/Components/VisionHub';
import TaskShelf from '@/Components/TaskShelf';
import PathCompanion from '@/Components/PathCompanion';
import { Trophy, Zap, Award, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ 
    stats,
    todayTodos, 
    dailyHabits,
    goals,
    pathGuidance,
    heartsCount 
}) {
    const { auth } = usePage().props;
    const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

    const [localTodos, setLocalTodos] = useState(todayTodos.data || []);

    useEffect(() => {
        if (todayTodos.current_page > 1) {
            setLocalTodos(prev => {
                const newItems = todayTodos.data.filter(item => !prev.some(p => p.id === item.id));
                return [...prev, ...newItems];
            });
        } else {
            setLocalTodos(todayTodos.data || []);
        }
    }, [todayTodos]);




    const loadMore = (resource, nextUrl) => {
        if (!nextUrl) return;
        router.visit(nextUrl, {
            only: [resource],
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hour = new Date().getHours();
    let greeting = 'Good Day';
    if (hour < 12) greeting = 'Rise & Shine';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="pt-4 pb-32 max-w-7xl mx-auto px-6 sm:px-8 space-y-8 md:space-y-12">
                
                {/* 1. Command Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.8]">
                            {greeting},<br />
                            <span className="text-emerald-500">{auth.user.name.split(' ')[0]}</span>.
                        </h1>
                    </div>

                    {/* Integrated Mastery HUD */}
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 p-4 px-6 rounded-[2.5rem] shadow-xl shadow-slate-100 dark:shadow-none flex items-center justify-between md:justify-start space-x-6 h-24 w-full md:w-auto">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex flex-col items-center justify-center text-white shadow-lg shadow-slate-100 dark:shadow-none">
                                    <span className="text-[7px] font-black uppercase leading-none opacity-50">LVL</span>
                                    <span className="text-lg font-black leading-none">{stats.level}</span>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">XP Points</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{stats.xp} <span className="opacity-30">/</span> {stats.xp_needed}</p>
                                </div>
                            </div>
                            
                            <div className="hidden lg:block w-32 h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                                <motion.div 
                                    className="h-full bg-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.xp / stats.xp_needed) * 100}%` }}
                                />
                            </div>

                            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

                            <div className="flex items-center space-x-2">
                                {stats.badges.slice(0, 3).map((badge) => (
                                    <div key={badge} className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-800/30 shadow-sm dark:shadow-none" title={badge}>
                                        <Award size={16} />
                                    </div>
                                ))}
                                {stats.badges.length === 0 && <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">No Medals</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Proactive Guidance (Path AI Coach) */}
                <PathCompanion guidance={pathGuidance} />

                {/* 3. Operational Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Execution Center (Pillar 1) */}
                    <div className="lg:col-span-7">
                        <TaskShelf 
                            todos={localTodos} 
                            nextUrl={todayTodos.next_page_url} 
                            onLoadMore={() => loadMore('todayTodos', todayTodos.next_page_url)} 
                        />
                    </div>

                    {/* Discipline Module (Pillar 2) */}
                    <div className="lg:col-span-5">
                        <ActionShelf 
                            habits={dailyHabits.data || []} 
                            heartsCount={heartsCount} 
                        />
                    </div>
                </div>

                {/* 4. Strategic Foundation (Pillar 3) */}
                <div className="pt-8 border-t-2 border-slate-50 dark:border-slate-800">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 text-center">The Vision Roadmap</span>
                        <div className="w-12 h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                    <VisionHub 
                        goals={goals} 
                    />
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

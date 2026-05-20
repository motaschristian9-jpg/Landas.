import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
    Plus, Heart, Flame, Calendar, Info, 
    CheckCircle2, Circle, MoreVertical, Trash2,
    Settings2, Sparkles, Activity, Target, ChevronRight
} from 'lucide-react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { useTheme } from '@/Contexts/ThemeContext';

export default function Index({ habits, heartsCount }) {
    const [localHabits, setLocalHabits] = useState(habits?.data || []);
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [habitToDelete, setHabitToDelete] = useState(null);

    const { data, setData, post, put, processing, reset } = useForm({
        title: '',
        description: '',
        icon: 'Activity',
        color: 'emerald',
        scheduled_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    });

    const days = [
        { key: 'monday', label: 'M' },
        { key: 'tuesday', label: 'T' },
        { key: 'wednesday', label: 'W' },
        { key: 'thursday', label: 'T' },
        { key: 'friday', label: 'F' },
        { key: 'saturday', label: 'S' },
        { key: 'sunday', label: 'S' },
    ];

    const submit = (e) => {
        e.preventDefault();
        if (editingHabit) {
            put(route('habits.update', editingHabit.id), {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingHabit(null);
                    reset();
                },
            });
        } else {
            post(route('habits.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const toggleHabit = (habit) => {
        if (habit.is_completed_today) return;
        router.post(route('habits.log', habit.id), {}, { preserveScroll: true });
    };

    const recoverStreak = (habit) => {
        if (heartsCount > 0) {
            router.post(route('habits.recover', habit.id), {}, { preserveScroll: true });
        }
    };

    useEffect(() => {
        setLocalHabits(habits?.data || []);
    }, [habits]);

    const deleteHabit = (habit) => {
        setHabitToDelete(habit);
    };

    const changePage = (url) => {
        if (!url) return;
        router.visit(url, {
            only: ['habits'],
            preserveState: true,
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        if (habitToDelete) {
            router.delete(route('habits.destroy', habitToDelete.id), {
                preserveScroll: true,
                onSuccess: () => setHabitToDelete(null)
            });
        }
    };

    const openEdit = (habit) => {
        setEditingHabit(habit);
        setData({
            title: habit.title,
            description: habit.description || '',
            icon: habit.icon || 'Activity',
            color: habit.color || 'emerald',
            scheduled_days: habit.scheduled_days || [],
        });
        setShowModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daily Discipline" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
                
                {/* 1. Header & Vision Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white">Pillar Two</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.8] mb-6">
                            Daily <span className="text-emerald-500">Discipline.</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-lg leading-relaxed">
                            We are what we repeatedly do. Excellence, then, is not an act, but a habit.
                        </p>
                    </div>

                    <div className="mt-8 md:mt-0 flex items-center space-x-6">
                        <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 dark:shadow-none flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                                <Heart size={24} className="fill-current" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Streak Armor</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{heartsCount} Hearts</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => { setEditingHabit(null); reset(); setShowModal(true); }}
                            className="w-20 h-20 rounded-[2.5rem] bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all active:scale-90 shadow-2xl shadow-slate-200 dark:shadow-none"
                        >
                            <Plus size={36} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* 2. Habits Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <AnimatePresence mode="popLayout">
                        {localHabits.map((habit) => (
                            <motion.div
                                key={habit.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border-2 border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none group relative overflow-hidden"
                            >
                                {/* Background Glow */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${habit.color || 'emerald'}-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`}></div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="flex items-center space-x-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-${habit.color || 'emerald'}-500 flex items-center justify-center text-white shadow-lg shadow-${habit.color || 'emerald'}-500/20 transition-colors`}>
                                            <Activity size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none mb-2">{habit.title}</h3>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center space-x-1 text-orange-500">
                                                    <Flame size={14} className="fill-current" />
                                                    <span className="text-sm font-black tracking-tight text-slate-400">{habit.streak} Day Streak</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => openEdit(habit)}
                                            className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700 active:scale-90"
                                        >
                                            <Settings2 size={20} />
                                        </button>
                                        <button 
                                            onClick={() => deleteHabit(habit)}
                                            className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700 active:scale-90"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-slate-400 font-medium leading-relaxed mb-8 relative z-10 transition-colors">
                                    {habit.description || "The hardest part is showing up."}
                                </p>

                                {/* Consistency Heatmap (Simple dots for last 30 days) */}
                                <div className="space-y-4 mb-8 relative z-10">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Momentum Map</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                                            {habit.total_logs} Total Check-ins
                                        </span>
                                    </div>
                                    
                                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-end space-x-4 overflow-x-auto">
                                        {/* Day Labels */}
                                        <div className="flex flex-col space-y-2 pb-1">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                                <span key={`${d}-${i}`} className="text-[8px] font-black text-slate-300 w-3 h-3.5 flex items-center justify-center">{d}</span>
                                            ))}
                                        </div>

                                        {/* Weekly Columns */}
                                        <div className="flex space-x-2">
                                            {(() => {
                                                const weeks = [];
                                                const paddedDays = [];
                                                if (habit.last_30_days && habit.last_30_days.length > 0) {
                                                    const parts = habit.last_30_days[0].date.split('-');
                                                    const firstDate = new Date(parts[0], parts[1] - 1, parts[2]);
                                                    let dayOfWeek = firstDate.getDay();
                                                    let emptyCells = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                                                    for (let i = 0; i < emptyCells; i++) {
                                                        paddedDays.push(null);
                                                    }
                                                    paddedDays.push(...habit.last_30_days);
                                                }
                                                for (let i = 0; i < paddedDays.length; i += 7) {
                                                    weeks.push(paddedDays.slice(i, i + 7));
                                                }
                                                return weeks.map((week, wIdx) => (
                                                    <div key={wIdx} className="flex flex-col space-y-2">
                                                        {week.map((day, dIdx) => {
                                                            if (!day) return <div key={dIdx} className="w-3.5 h-3.5 rounded-sm bg-transparent" />;
                                                            const isToday = day.date === habit.last_30_days[habit.last_30_days.length - 1].date;
                                                            const isDone = day.completed || (isToday && habit.is_completed_today);
                                                            return (
                                                                <div 
                                                                    key={dIdx}
                                                                    className={`w-3.5 h-3.5 rounded-sm transition-all ${
                                                                         isDone 
                                                                         ? `bg-${habit.color || 'emerald'}-500 shadow-sm shadow-${habit.color || 'emerald'}-500/20 scale-110` 
                                                                         : 'bg-slate-200 dark:bg-slate-800'
                                                                     } ${isToday ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                                                                    title={`${day.date}${isToday ? ' (Today)' : ''}`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                ));
                                            })()}
                                        </div>

                                        <div className="flex-1 text-right">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consistency</div>
                                            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                {Math.round((habit.logs_count / 30) * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="mt-8 relative z-10">
                                    {habit.is_completed_today ? (
                                        <div className={`w-full py-5 rounded-2xl bg-${habit.color || 'emerald'}-500/10 text-${habit.color || 'emerald'}-600 border-2 border-${habit.color || 'emerald'}-200 flex items-center justify-center space-x-3`}>
                                            <CheckCircle2 size={20} strokeWidth={3} />
                                            <span className="text-xs font-black uppercase tracking-widest">Mastered for Today</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <HabitSlider 
                                                habit={habit} 
                                                onComplete={() => toggleHabit(habit)} 
                                                processing={processing}
                                            />
                                            
                                            {habit.streak === 0 && habit.logs_count > 0 && heartsCount > 0 && (
                                                <button 
                                                    onClick={() => recoverStreak(habit)}
                                                    className="w-full py-4 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-200 dark:shadow-none font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                                                >
                                                    <Heart size={16} className="fill-current" />
                                                    <span>Armor Streak (1 Heart)</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {habits?.last_page > 1 && (
                        <div className="lg:col-span-2 pt-12 flex flex-col items-center">
                            <div className="flex items-center space-x-2">
                                {habits.links.map((link, i) => {
                                    if (link.label.includes('Previous') || link.label.includes('Next')) return null;
                                    
                                    return (
                                        <button
                                            key={i}
                                            disabled={!link.url || link.active}
                                            onClick={() => changePage(link.url)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                                                link.active 
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                                                    : link.url 
                                                        ? 'bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:text-emerald-500' 
                                                        : 'opacity-0'
                                            }`}
                                        >
                                            {link.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {localHabits.length === 0 && (
                        <div className="lg:col-span-2 py-32 flex flex-col items-center justify-center border-4 border-dashed border-slate-50 dark:border-slate-800 rounded-[4rem]">
                            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center text-emerald-500 mb-8">
                                <Activity size={48} strokeWidth={2} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">No Discipline Defined.</h3>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm max-w-sm text-center mb-10 leading-relaxed">Your future is created by what you do today, not tomorrow.</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-slate-900 dark:bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-emerald-200 dark:hover:shadow-none active:scale-95"
                            >
                                Begin Ritual
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Creation/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowModal(false)}></div>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border-4 border-white dark:border-slate-800 shadow-2xl"
                    >

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {editingHabit ? 'Refine Discipline' : 'Forge Discipline'}<span className="text-emerald-500">.</span>
                            </h2>
                            <button onClick={() => setShowModal(false)} type="button" className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all group shadow-sm shrink-0">
                                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-8 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Habit Identity</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    required 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g., Morning Meditation" 
                                    className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-xl dark:text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">The Ritual (Description)</label>
                                <textarea 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Define the cues and rewards..." 
                                    className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-base dark:text-white focus:border-emerald-500 outline-none transition-all min-h-[80px] resize-none placeholder:text-slate-200 dark:placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Battle Days (Schedule)</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {days.map(day => (
                                        <button
                                            key={day.key}
                                            type="button"
                                            onClick={() => {
                                                const current = data.scheduled_days || [];
                                                const updated = current.includes(day.key)
                                                    ? current.filter(d => d !== day.key)
                                                    : [...current, day.key];
                                                setData('scheduled_days', updated);
                                            }}
                                            className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${
                                                data.scheduled_days?.includes(day.key)
                                                ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-lg shadow-slate-100 dark:shadow-none'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
                                            }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 dark:shadow-none mt-6 active:scale-95 disabled:opacity-50"
                            >
                                {editingHabit ? 'Save Refinements' : 'Commit to Discipline'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Deletion Confirmation */}
            <ConfirmationModal 
                show={!!habitToDelete}
                onClose={() => setHabitToDelete(null)}
                onConfirm={confirmDelete}
                title="Shatter Discipline?"
                message={habitToDelete ? `Are you sure you want to remove "${habitToDelete.title}"? Your streak and history will be lost.` : ''}
                confirmText="Break Habit"
            />
        </AuthenticatedLayout>
    );
}

function HabitSlider({ habit, onComplete, processing }) {
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
            setConstraints({ left: 0, right: trackWidth - handleWidth - 16 }); // 16 for p-2
        }
    }, []);

    const handleDragEnd = () => {
        if (x.get() > constraints.right - 20 && !isTriggered) {
            setIsTriggered(true);
            onComplete();
        }
    };

    return (
        <div className="relative">
            <motion.div 
                ref={containerRef}
                style={{ background }}
                className="h-20 w-full rounded-full relative overflow-hidden flex items-center p-2 border-2 border-slate-50 dark:border-slate-800 shadow-inner"
            >
                <motion.div 
                    style={{ opacity }}
                    className="absolute inset-0 flex items-center justify-center pl-16 md:pl-0 font-black text-[9px] uppercase tracking-[0.15em] md:tracking-[0.4em] text-slate-400 dark:text-slate-500 pointer-events-none whitespace-nowrap"
                >
                    {processing ? 'Processing...' : 'Slide to Discipline'}
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
    );
}

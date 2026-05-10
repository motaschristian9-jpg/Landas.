import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, CheckCircle2, Trash2, Settings2, ChevronRight, Compass, TrendingUp, Check, MapPin, Sparkles } from 'lucide-react';

export default function Index({ goals, categories, priorities, total_completed }) {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showEditGoalModal, setShowEditGoalModal] = useState(false);
    const shelfRef = useRef(null);
    const constraintsRef = useRef(null);
    const [dragWidth, setDragWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (shelfRef.current) {
            setDragWidth(shelfRef.current.scrollWidth - shelfRef.current.offsetWidth);
        }
    }, [goals.data]);

    useEffect(() => {
        if (goals.data.length > 0) {
            if (!selectedGoal) {
                setSelectedGoal(goals.data[0]);
            } else {
                const updated = goals.data.find(g => g.id === selectedGoal.id);
                if (updated) setSelectedGoal(updated);
                else setSelectedGoal(goals.data[0]);
            }
        } else {
            setSelectedGoal(null);
        }
    }, [goals.data]);

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        category_id: '',
        priority_id: '2',
        target_date: '',
        status: 'in_progress',
    });

    const editForm = useForm({
        title: '',
        description: '',
        category_id: '',
        priority_id: '',
        target_date: '',
        status: '',
    });

    const milestoneForm = useForm({
        title: ''
    });

    const openEditModal = (goal) => {
        editForm.setData({
            title: goal.title || '',
            description: goal.description || '',
            category_id: goal.category_id || '',
            priority_id: goal.priority_id || '',
            target_date: goal.target_date || '',
            status: goal.status || '',
        });
        setShowEditGoalModal(true);
    };

    const submitCreateGoal = (e) => {
        e.preventDefault();
        post(route('goals.store'), {
            onSuccess: () => {
                setShowGoalModal(false);
                reset();
            },
        });
    };

    const submitEditGoal = (e) => {
        e.preventDefault();
        editForm.put(route('goals.update', selectedGoal.id), {
            onSuccess: () => setShowEditGoalModal(false),
        });
    };

    const addMilestone = (e) => {
        e.preventDefault();
        milestoneForm.post(route('goals.milestones.store', selectedGoal.id), {
            onSuccess: () => milestoneForm.reset(),
            preserveScroll: true
        });
    };

    const toggleMilestone = (milestoneId) => {
        router.patch(route('goals.milestones.toggle', [selectedGoal.id, milestoneId]), {}, {
            preserveScroll: true
        });
    };

    const deleteGoal = (goal) => {
        if (confirm(`Are you sure you want to delete the vision '${goal.title}'?`)) {
            router.delete(route('goals.destroy', goal.id), {
                onSuccess: () => setSelectedGoal(goals.data[0] || null),
            });
        }
    };

    const navigate = (url) => {
        if (!url) return;
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const calculateProgress = (goal) => {
        if (!goal.milestones?.length) return 0;
        const completed = goal.milestones.filter(m => m.is_completed).length;
        return Math.round((completed / goal.milestones.length) * 100);
    };

    const completedCount = total_completed || goals.data.filter(g => calculateProgress(g) === 100).length;

    return (
        <AuthenticatedLayout>
            <Head title="Vision Hub | Mastery" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 flex flex-col space-y-10">
                
                {/* Mastery Island Header */}
                <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-3 mb-4"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <Sparkles size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Pillar Three</span>
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] mb-4">
                                Vision <span className="text-emerald-500">Hub.</span>
                            </h1>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-lg md:text-xl max-w-xl">
                                Architect your future by breaking bold ambitions into actionable mastery.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-4 md:p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 dark:shadow-none flex items-center space-x-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{completedCount}</p>
                                </div>
                            </motion.div>

                            <button 
                                onClick={() => setShowGoalModal(true)}
                                className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all active:scale-90 shadow-2xl shadow-slate-200 dark:shadow-none group"
                            >
                                <Plus size={40} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {goals.data.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-24 px-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 rounded-[4rem] flex flex-col items-center justify-center"
                    >
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center text-emerald-500 mb-8">
                            <Target size={48} strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-3">Your Roadmap is Blank</h3>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm max-w-sm mb-10 mx-auto leading-relaxed">
                            Every great achievement starts with a single vision. Launch your first one now and begin your journey to mastery.
                        </p>
                        <button 
                            onClick={() => setShowGoalModal(true)}
                            className="bg-slate-900 dark:bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-emerald-200 dark:hover:shadow-none active:scale-95"
                        >
                            Launch Vision
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Draggable Vision Shelf */}
                        <div className="relative group overflow-hidden" ref={constraintsRef}>
                            <motion.div 
                                key={goals.current_page}
                                drag="x"
                                dragConstraints={{ right: 0, left: -dragWidth - 40 }}
                                dragElastic={0.1}
                                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
                                ref={shelfRef}
                                className="flex md:grid md:grid-cols-4 gap-6 pb-10 px-1 cursor-grab active:cursor-grabbing md:cursor-default"
                            >
                                {goals.data.map((goal, idx) => (
                                    <motion.div
                                        key={goal.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => !isDragging && setSelectedGoal(goal)}
                                        className={`snap-center shrink-0 w-[85%] md:w-full p-8 rounded-[3rem] border-2 text-left transition-all ${
                                            selectedGoal?.id === goal.id 
                                            ? 'border-emerald-500 shadow-2xl shadow-emerald-100/40 dark:shadow-none bg-emerald-50/20 dark:bg-emerald-500/5 scale-[1.02]' 
                                            : 'border-slate-50 dark:border-slate-800 shadow-lg shadow-slate-100/30 dark:shadow-none bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-500/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${
                                                selectedGoal?.id === goal.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                            }`}>
                                                <Target size={28} strokeWidth={2.5} />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Impact</span>
                                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] inline-block ${
                                                    selectedGoal?.id === goal.id ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                    {goal.priority?.name || 'Standard'}
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter leading-[1.1] mb-6 line-clamp-2 min-h-[3rem]">
                                            {goal.title}
                                        </h3>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-end mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</span>
                                                <span className={`font-black text-xl ${selectedGoal?.id === goal.id ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                                                    {calculateProgress(goal)}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className={`h-full rounded-full ${selectedGoal?.id === goal.id ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${calculateProgress(goal)}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                            
                            {/* Pagination Navigation */}
                            <div className="flex items-center justify-center space-x-6 mb-8">
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate(goals.prev_page_url)}
                                    disabled={!goals.prev_page_url}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                        goals.prev_page_url 
                                        ? 'border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-500' 
                                        : 'border-slate-50 dark:border-slate-900 text-slate-200 dark:text-slate-800 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    <ChevronRight size={24} className="rotate-180" />
                                </motion.button>

                                <div className="flex items-center space-x-2">
                                    {[...Array(goals.last_page)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                goals.current_page === i + 1 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-slate-800'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate(goals.next_page_url)}
                                    disabled={!goals.next_page_url}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                        goals.next_page_url 
                                        ? 'border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-500' 
                                        : 'border-slate-50 dark:border-slate-900 text-slate-200 dark:text-slate-800 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    <ChevronRight size={24} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Mastery Detail Panel */}
                        <AnimatePresence mode="wait">
                            {selectedGoal && (
                                <motion.div 
                                    key={selectedGoal.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                    className="bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Strategic Intent (Sidebar) */}
                                        <div className="lg:w-80 bg-slate-50 dark:bg-slate-800/30 p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center space-x-2">
                                                    <Compass size={18} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Blueprint</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => openEditModal(selectedGoal)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90">
                                                        <Settings2 size={16} />
                                                    </button>
                                                    <button onClick={() => deleteGoal(selectedGoal)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-6">
                                                {selectedGoal.title}
                                            </h2>
                                            
                                            <div className="flex-1">
                                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-[2rem] mb-8 border border-white dark:border-slate-800">
                                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                        "{selectedGoal.description || 'Architecting greatness through silence.'}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-8 border-t border-slate-200/50 dark:border-slate-800">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target</span>
                                                    <span className="text-xs font-black text-slate-900 dark:text-white">
                                                        {selectedGoal.target_date ? new Date(selectedGoal.target_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Eternal Vision'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Field</span>
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                        {selectedGoal.category?.name || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actionable Timeline (Main Content) */}
                                        <div className="flex-1 p-10 md:p-14">
                                            <div className="flex items-center justify-between mb-12">
                                                <div className="flex items-center space-x-3">
                                                    <TrendingUp size={20} className="text-emerald-500" />
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Mastery Roadmap</h3>
                                                </div>
                                                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full">
                                                    {selectedGoal.milestones?.filter(m => m.is_completed).length || 0} / {selectedGoal.milestones?.length || 0} Milestones
                                                </div>
                                            </div>

                                            <div className="relative pl-12 space-y-8 before:absolute before:inset-y-0 before:left-[19px] before:w-1 before:bg-slate-100 dark:before:bg-slate-800 before:rounded-full">
                                                {(selectedGoal.milestones || []).map((ms, index) => (
                                                    <motion.div 
                                                        key={ms.id} 
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="relative group"
                                                    >
                                                        {/* Step Bubble */}
                                                        <button 
                                                            onClick={() => toggleMilestone(ms.id)}
                                                            className={`absolute -left-[45px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 transition-all z-10 shadow-sm ${
                                                                ms.is_completed 
                                                                ? 'bg-emerald-500 text-white scale-110' 
                                                                : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 text-transparent'
                                                            }`}
                                                        >
                                                            <Check size={16} strokeWidth={4} />
                                                        </button>

                                                        <div className="relative">
                                                            <button 
                                                                onClick={() => toggleMilestone(ms.id)}
                                                                className={`w-full text-left p-6 rounded-[2rem] transition-all flex items-center justify-between group/card ${
                                                                    ms.is_completed 
                                                                    ? 'bg-emerald-50/30 dark:bg-emerald-500/5 opacity-60' 
                                                                    : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none border border-transparent hover:border-slate-100 dark:hover:border-slate-700'
                                                                }`}
                                                            >
                                                                <span className={`text-base font-black tracking-tight transition-colors ${ms.is_completed ? 'text-slate-400 line-through decoration-emerald-500 decoration-2' : 'text-slate-800 dark:text-slate-200 group-hover/card:text-emerald-500'}`}>
                                                                    {ms.title}
                                                                </span>
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all ${ms.is_completed ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                                    <CheckCircle2 size={18} />
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                
                                                {/* Milestone Creation Node */}
                                                <div className="relative pt-4">
                                                    <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-emerald-500 z-10 shadow-sm">
                                                        <Plus size={16} strokeWidth={4} />
                                                    </div>
                                                    <form onSubmit={addMilestone} className="relative group">
                                                        <input 
                                                            type="text" 
                                                            value={milestoneForm.data.title}
                                                            onChange={e => milestoneForm.setData('title', e.target.value)}
                                                            placeholder="Next step..."
                                                            className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-[2rem] pl-8 pr-16 py-6 text-base font-black dark:text-white outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                                        />
                                                        <button 
                                                            type="submit" 
                                                            disabled={!milestoneForm.data.title.trim() || milestoneForm.processing}
                                                            className="absolute right-3 top-3 bottom-3 aspect-square bg-slate-900 dark:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg hover:bg-emerald-500 dark:hover:bg-emerald-600 active:scale-90"
                                                        >
                                                            <Plus size={24} strokeWidth={3} />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            {/* Vision Sculptor Modal */}
            <AnimatePresence>
                {(showGoalModal || showEditGoalModal) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/80 backdrop-blur-2xl" 
                            onClick={() => { setShowGoalModal(false); setShowEditGoalModal(false); }}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-14 border-4 border-white dark:border-slate-800 shadow-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">
                                        {showEditGoalModal ? 'Refine' : 'Launch'}<span className="text-emerald-500"> Vision.</span>
                                    </h2>
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Mastery Framework</p>
                                </div>
                                <button onClick={() => { setShowGoalModal(false); setShowEditGoalModal(false); }} className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-slate-100 dark:border-slate-700">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={showEditGoalModal ? submitEditGoal : submitCreateGoal} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Vision Identity</label>
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={showEditGoalModal ? editForm.data.title : data.title}
                                        onChange={e => showEditGoalModal ? editForm.setData('title', e.target.value) : setData('title', e.target.value)}
                                        placeholder="e.g. Conquer the North Peak"
                                        className="w-full px-8 py-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-black text-xl md:text-2xl dark:text-white outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Strategic Narrative</label>
                                    <textarea 
                                        value={showEditGoalModal ? editForm.data.description : data.description}
                                        onChange={e => showEditGoalModal ? editForm.setData('description', e.target.value) : setData('description', e.target.value)}
                                        placeholder="Why does this mastery matter?" 
                                        className="w-full px-8 py-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-bold dark:text-white outline-none transition-all h-32 resize-none placeholder:text-slate-200 dark:placeholder:text-slate-700"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Field</label>
                                        <select 
                                            value={showEditGoalModal ? editForm.data.category_id : data.category_id}
                                            onChange={e => showEditGoalModal ? editForm.setData('category_id', e.target.value) : setData('category_id', e.target.value)}
                                            className="w-full px-6 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-black text-xs dark:text-white uppercase tracking-widest outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select Field</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id} className="dark:bg-slate-900">{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Target Date</label>
                                        <input 
                                            type="date" 
                                            value={showEditGoalModal ? editForm.data.target_date : data.target_date}
                                            onChange={e => showEditGoalModal ? editForm.setData('target_date', e.target.value) : setData('target_date', e.target.value)}
                                            className="w-full px-6 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-black dark:text-white text-xs uppercase tracking-widest outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" disabled={processing} className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 dark:shadow-none active:scale-95 flex items-center justify-center space-x-3">
                                        <Sparkles size={18} />
                                        <span>{showEditGoalModal ? 'Commit Refinement' : 'Launch Vision'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}

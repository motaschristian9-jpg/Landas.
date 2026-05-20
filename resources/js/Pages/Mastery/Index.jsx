import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Target, CheckCircle2, Trash2, Settings2, 
    ChevronRight, Compass, TrendingUp, Check, 
    Sparkles, Zap, Timer, Trophy, Flag, Layers
} from 'lucide-react';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Index({ goals, categories, priorities, total_completed }) {
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showEditGoalModal, setShowEditGoalModal] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

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
            priority_id: String(goal.priority_id) || '',
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

    const deleteMilestone = (milestoneId) => {
        router.delete(route('goals.milestones.destroy', [selectedGoal.id, milestoneId]), {
            preserveScroll: true
        });
    };

    const handleDeleteMilestone = (e, milestoneId) => {
        e.stopPropagation();
        deleteMilestone(milestoneId);
    };

    const deleteGoal = (goal) => {
        setGoalToDelete(goal);
    };

    const confirmDelete = () => {
        if (goalToDelete) {
            router.delete(route('goals.destroy', goalToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setGoalToDelete(null);
                }
            });
        }
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
                
                {/* Header Section - Aligned with Habits/Todos */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white">Pillar Three</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.8] mb-6">
                            Vision <span className="text-emerald-500">Hub.</span>
                        </h1>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-lg leading-relaxed">
                            Architect your future by breaking bold ambitions into actionable mastery.
                        </p>
                    </div>

                    <div className="mt-8 md:mt-0 flex items-center space-x-6">
                        <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 dark:shadow-none flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{completedCount}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => { setShowGoalModal(true); reset(); }}
                            className="w-20 h-20 rounded-[2.5rem] bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all active:scale-90 shadow-2xl shadow-slate-200 dark:shadow-none group"
                        >
                            <Plus size={36} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
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
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mb-3">Your Roadmap is Blank</h3>
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Side: Navigation & Stats - Aligned with Todos */}
                        <div className="lg:col-span-4 flex flex-col space-y-8">
                            <div className="bg-slate-900 dark:bg-slate-800/50 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none w-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Active Roadmap</span>
                                        <Zap size={20} className="text-emerald-400 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter leading-[1.1] mb-6">Mastery List.</h2>
                                    <div className="space-y-3">
                                        {goals.data.map(goal => (
                                            <button
                                                key={goal.id}
                                                onClick={() => setSelectedGoal(goal)}
                                                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${
                                                    selectedGoal?.id === goal.id 
                                                    ? 'bg-white text-slate-900 shadow-xl' 
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3 truncate">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                        selectedGoal?.id === goal.id ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600'
                                                    }`}>
                                                        <Target size={16} />
                                                    </div>
                                                    <span className="font-black text-xs truncate uppercase tracking-widest">{goal.title}</span>
                                                </div>
                                                <span className={`text-[10px] font-black ${selectedGoal?.id === goal.id ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                    {calculateProgress(goal)}%
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {goals.last_page > 1 && (
                                        <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t border-white/5">
                                            <button 
                                                onClick={() => router.visit(goals.prev_page_url, { preserveState: true, preserveScroll: true })}
                                                disabled={!goals.prev_page_url}
                                                className="p-2 text-slate-500 hover:text-white disabled:opacity-20"
                                            >
                                                <ChevronRight size={20} className="rotate-180" />
                                            </button>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                Page {goals.current_page} of {goals.last_page}
                                            </div>
                                            <button 
                                                onClick={() => router.visit(goals.next_page_url, { preserveState: true, preserveScroll: true })}
                                                disabled={!goals.next_page_url}
                                                className="p-2 text-slate-500 hover:text-white disabled:opacity-20"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Detailed Roadmap - Aligned with Todos Timeline */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {selectedGoal && (
                                    <motion.div
                                        key={selectedGoal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        {/* Vision Header Card */}
                                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-200 dark:shadow-none">
                                                        <Trophy size={36} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                                                {selectedGoal.category?.name || 'General Mastery'}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                                                {selectedGoal.target_date ? new Date(selectedGoal.target_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Eternal Vision'}
                                                            </span>
                                                        </div>
                                                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{selectedGoal.title}</h2>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 self-end md:self-start">
                                                    <button onClick={() => openEditModal(selectedGoal)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700 active:scale-90">
                                                        <Settings2 size={20} />
                                                    </button>
                                                    <button onClick={() => deleteGoal(selectedGoal)} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700 active:scale-90">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-lg font-bold text-slate-400 dark:text-slate-500 leading-relaxed max-w-2xl mb-10 italic">
                                                "{selectedGoal.description || 'Architecting greatness through silence.'}"
                                            </p>

                                            <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Roadmap Execution</span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{calculateProgress(selectedGoal)}% Ready</span>
                                                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            className="h-full bg-emerald-500"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${calculateProgress(selectedGoal)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Milestones List */}
                                        <div className="relative space-y-6">
                                            
                                            <div className="mb-8 pt-2">
                                                <div className="flex items-center space-x-3">
                                                    <TrendingUp size={18} className="text-emerald-500" />
                                                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Trajectory Milestones</h4>
                                                </div>
                                            </div>

                                            <AnimatePresence mode="popLayout">
                                                {(selectedGoal.milestones || []).map((ms, index) => (
                                                    <motion.div 
                                                        key={ms.id}
                                                        layout
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className={`group relative p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${
                                                            ms.is_completed 
                                                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-50 dark:border-slate-800 opacity-60' 
                                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30'
                                                        }`}
                                                        onClick={() => toggleMilestone(ms.id)}
                                                    >
                                                        
                                                        <div className="flex items-center space-x-6">
                                                            <div className={ms.is_completed ? 'text-emerald-500' : 'text-slate-200 dark:text-slate-700'}>
                                                                <CheckCircle2 size={24} strokeWidth={3} />
                                                            </div>
                                                            <span className={`text-lg font-black tracking-tight ${ms.is_completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                                                {ms.title}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => handleDeleteMilestone(e, ms.id)}
                                                            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-100 dark:border-slate-700 active:scale-90 shrink-0"
                                                            title="Delete Milestone"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {/* Add Milestone Node */}
                                            <div className="relative pt-4">
                                                <form onSubmit={addMilestone} className="relative group">
                                                    <input 
                                                        type="text" 
                                                        value={milestoneForm.data.title}
                                                        onChange={e => milestoneForm.setData('title', e.target.value)}
                                                        placeholder="Forge new milestone..."
                                                        className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-[2rem] pl-8 pr-16 py-6 text-base font-black dark:text-white outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                    />
                                                    <button 
                                                        type="submit" 
                                                        disabled={!milestoneForm.data.title.trim() || milestoneForm.processing}
                                                        className="absolute right-3 top-3 bottom-3 aspect-square bg-slate-900 dark:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg active:scale-90"
                                                    >
                                                        <Plus size={24} strokeWidth={3} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            {/* Vision Sculptor Modal - EXACT Alignment with Habits/Todos */}
            {/* Using the standard backdrop and transition patterns identified in Todos/Habits */}
            <AnimatePresence>
                {(showGoalModal || showEditGoalModal) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => { setShowGoalModal(false); setShowEditGoalModal(false); }}></div>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-10 border-4 border-white dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        >
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {showEditGoalModal ? 'Refine Vision' : 'Forge Vision'}<span className="text-emerald-500">.</span>
                                </h2>
                                <button onClick={() => { setShowGoalModal(false); setShowEditGoalModal(false); }} type="button" className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all group shadow-sm shrink-0 border border-slate-100 dark:border-slate-700">
                                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>

                            <form onSubmit={showEditGoalModal ? submitEditGoal : submitCreateGoal} className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Vision Identity</label>
                                    <input 
                                        autoFocus
                                        type="text" 
                                        required
                                        value={showEditGoalModal ? editForm.data.title : data.title}
                                        onChange={e => showEditGoalModal ? editForm.setData('title', e.target.value) : setData('title', e.target.value)}
                                        placeholder="e.g. Conquer the North Peak"
                                        className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 font-black text-xl dark:text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Strategic Narrative</label>
                                    <textarea 
                                        value={showEditGoalModal ? editForm.data.description : data.description}
                                        onChange={e => showEditGoalModal ? editForm.setData('description', e.target.value) : setData('description', e.target.value)}
                                        placeholder="Why does this mastery matter?" 
                                        className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-base dark:text-white focus:border-emerald-500 outline-none transition-all min-h-[80px] resize-none placeholder:text-slate-200 dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Vision Field</label>
                                        <select 
                                            value={showEditGoalModal ? editForm.data.category_id : data.category_id}
                                            onChange={e => showEditGoalModal ? editForm.setData('category_id', e.target.value) : setData('category_id', e.target.value)}
                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-white font-bold text-xs uppercase tracking-widest focus:border-emerald-500 outline-none transition-all appearance-none"
                                        >
                                            <option value="" className="dark:bg-slate-900">Select Field</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id} className="dark:bg-slate-900">{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Target Date</label>
                                        <input 
                                            type="date" 
                                            value={showEditGoalModal ? editForm.data.target_date : data.target_date}
                                            onChange={e => showEditGoalModal ? editForm.setData('target_date', e.target.value) : setData('target_date', e.target.value)}
                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-white font-bold text-xs focus:border-emerald-500 outline-none transition-all dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Impact Priority</label>
                                    <div className="flex space-x-2">
                                        {priorities.map(priority => {
                                            const priorityKey = priority.name.toLowerCase();
                                            const isActive = showEditGoalModal 
                                                ? String(editForm.data.priority_id) === String(priority.id)
                                                : String(data.priority_id) === String(priority.id);
                                            
                                            return (
                                                <button
                                                    key={priority.id}
                                                    type="button"
                                                    onClick={() => showEditGoalModal ? editForm.setData('priority_id', String(priority.id)) : setData('priority_id', String(priority.id))}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                                        isActive
                                                        ? "bg-slate-900 dark:bg-emerald-500 text-white border-slate-900 dark:border-emerald-500 shadow-lg shadow-slate-200 dark:shadow-none"
                                                        : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                                                    }`}
                                                >
                                                    {priorityKey}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 dark:shadow-none mt-4 active:scale-95 disabled:opacity-50"
                                >
                                    {showEditGoalModal ? 'Save Refinements' : 'Launch Vision'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Deletion Confirmation */}
            <ConfirmationModal 
                show={!!goalToDelete}
                onClose={() => setGoalToDelete(null)}
                onConfirm={confirmDelete}
                title="Shatter Vision?"
                message={goalToDelete ? `Are you sure you want to remove "${goalToDelete.title}"? Your milestones and progress will be lost.` : ''}
                confirmText="Break Vision"
            />
        </AuthenticatedLayout>
    );
}

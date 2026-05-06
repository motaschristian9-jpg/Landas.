import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, CheckCircle2, Trash2, Calendar, Edit3, ChevronRight, Sparkles, Map, Flag, Compass, BarChart3 } from 'lucide-react';

export default function Index({ goals, categories, priorities }) {
    const [selectedGoal, setSelectedGoal] = useState(goals[0] || null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showEditGoalModal, setShowEditGoalModal] = useState(false);

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
                onSuccess: () => setSelectedGoal(goals[0] || null),
            });
        }
    };

    const calculateProgress = (goal) => {
        if (!goal.milestones?.length) return 0;
        const completed = goal.milestones.filter(m => m.is_completed).length;
        return Math.round((completed / goal.milestones.length) * 100);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Vision Hub | Pillar Three" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 flex flex-col space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">Pillar Three</span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-6">
                            Vision <span className="text-emerald-500">Hub.</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-lg">
                            Engineer your future through intentional progress.
                        </p>
                    </div>

                    <div className="mt-8 md:mt-0 flex flex-wrap items-center gap-6 relative z-10">
                        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm">
                                <Compass size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Visions</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">{goals.length}</p>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                                <p className="text-2xl font-black text-emerald-600 leading-none">{goals.filter(g => calculateProgress(g) === 100).length}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowGoalModal(true)}
                            className="w-20 h-20 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-500 transition-all active:scale-90 shadow-2xl shadow-slate-200"
                        >
                            <Plus size={36} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <div className="lg:col-span-4 space-y-4 h-full">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Master Catalog</h3>
                            <div className="p-1 bg-slate-100 rounded-lg flex space-x-1">
                                <button className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-600"><Compass size={14} /></button>
                                <button className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600"><Map size={14} /></button>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 hide-scrollbar">
                            {goals.map((goal) => (
                                <motion.button
                                    key={goal.id}
                                    whileHover={{ x: 8 }}
                                    onClick={() => setSelectedGoal(goal)}
                                    className={`w-full text-left p-8 rounded-[3rem] transition-all duration-500 group relative overflow-hidden border-2 ${
                                        selectedGoal?.id === goal.id 
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200' 
                                        : 'bg-white/60 border-white text-slate-600 hover:bg-white hover:shadow-xl'
                                    }`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                selectedGoal?.id === goal.id ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {goal.category?.name || 'Vision'}
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span className={`text-[10px] font-black ${selectedGoal?.id === goal.id ? 'text-white/40' : 'text-slate-300'}`}>
                                                    {calculateProgress(goal)}%
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-black tracking-tighter leading-tight mb-2">{goal.title}</h4>
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${calculateProgress(goal)}%` }}
                                                className={`h-full ${selectedGoal?.id === goal.id ? 'bg-emerald-500' : 'bg-emerald-500'}`}
                                            />
                                        </div>
                                    </div>
                                    {selectedGoal?.id === goal.id && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                            <ChevronRight size={48} strokeWidth={3} />
                                        </div>
                                    )}
                                </motion.button>
                            ))}

                            {goals.length === 0 && (
                                <div className="p-10 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic">No visions drafted yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {selectedGoal ? (
                                <motion.div
                                    key={selectedGoal.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-xl shadow-slate-100/50 p-12 flex flex-col min-h-[600px]"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-24 h-24 rounded-[3rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-300">
                                                <Target size={48} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Flag size={14} className="text-emerald-500" />
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Active Blueprint</p>
                                                </div>
                                                <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">{selectedGoal.title}</h2>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => openEditModal(selectedGoal)}
                                                className="px-6 py-4 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-all shadow-sm flex items-center space-x-2"
                                            >
                                                <Edit3 size={14} />
                                                <span>Refine</span>
                                            </button>
                                        </div>
                                    </div>

                                    {selectedGoal.description && (
                                        <div className="mb-12 p-8 bg-slate-50/50 rounded-[3rem] border border-white">
                                            <p className="text-slate-500 font-bold leading-relaxed italic">
                                                "{selectedGoal.description}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-6 mb-12">
                                        <div className="flex items-center justify-between px-2 mb-4">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Execution Roadmap</h4>
                                            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <BarChart3 size={14} />
                                                <span>{selectedGoal.milestones.filter(m => m.is_completed).length} / {selectedGoal.milestones.length} Milestones</span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute left-10 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                                            
                                            <div className="space-y-4 relative">
                                                {selectedGoal.milestones.map((ms, idx) => (
                                                    <motion.div 
                                                        key={ms.id} 
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="group flex items-start space-x-8"
                                                    >
                                                        <button 
                                                            onClick={() => toggleMilestone(ms.id)}
                                                            className={`shrink-0 w-20 h-20 rounded-[2.5rem] border-4 flex items-center justify-center transition-all duration-500 relative z-10 ${
                                                                ms.is_completed 
                                                                ? 'bg-emerald-500 border-white text-white shadow-xl shadow-emerald-200' 
                                                                : 'bg-white border-slate-50 text-slate-100 hover:border-emerald-500 hover:text-emerald-500 shadow-sm'
                                                            }`}
                                                        >
                                                            <CheckCircle2 size={32} strokeWidth={2.5} />
                                                        </button>

                                                        <div className={`flex-1 p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${
                                                            ms.is_completed 
                                                            ? 'bg-slate-50 border-white opacity-60' 
                                                            : 'bg-white border-slate-50 shadow-sm hover:shadow-xl hover:border-emerald-100'
                                                        }`}>
                                                            <span className={`text-2xl font-black tracking-tight ${ms.is_completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                                {ms.title}
                                                            </span>
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Step {idx + 1}</span>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {selectedGoal.milestones.length === 0 && (
                                                    <div className="py-24 text-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] ml-28">
                                                        <Sparkles size={64} className="mx-auto text-slate-200 mb-6" />
                                                        <h4 className="text-xl font-black text-slate-400 tracking-tight">Zero Milestones Found</h4>
                                                        <p className="text-slate-300 font-bold mt-2">Every vision needs a plan. Add your first step below.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="mt-auto">
                                        <form onSubmit={addMilestone} className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-[2rem] blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                                            <input 
                                                type="text" 
                                                value={milestoneForm.data.title}
                                                onChange={e => milestoneForm.setData('title', e.target.value)}
                                                placeholder="What's the next critical milestone?"
                                                className="relative w-full bg-slate-100/50 border-2 border-white rounded-[2rem] py-8 px-10 text-xl font-black text-slate-800 placeholder:text-slate-300 focus:bg-white focus:shadow-2xl transition-all outline-none"
                                            />
                                            <button 
                                                type="submit"
                                                disabled={milestoneForm.processing || !milestoneForm.data.title.trim()}
                                                className="absolute right-4 top-4 bottom-4 px-10 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-0 shadow-lg shadow-slate-200"
                                            >
                                                Add Step
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-white/40 rounded-[4rem] border-2 border-dashed border-slate-200">
                                    <Compass size={80} className="text-slate-200 mb-8 animate-bounce" />
                                    <h2 className="text-5xl font-black text-slate-300 tracking-tighter">Draft Your Mission.</h2>
                                    <p className="mt-4 text-slate-400 font-bold max-w-sm mx-auto">Select a vision from the sidebar to view its blueprint or create a new one to get started.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Vision Modal */}
            <AnimatePresence>
                {(showGoalModal || showEditGoalModal) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl" 
                            onClick={() => { setShowGoalModal(false); setShowEditGoalModal(false); }}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3.5rem] p-10 border-4 border-white shadow-2xl"
                        >
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">
                                {showEditGoalModal ? 'Refine Vision' : 'New Vision'}<span className="text-emerald-500">.</span>
                            </h2>

                            <form onSubmit={showEditGoalModal ? submitEditGoal : submitCreateGoal} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision Identity</label>
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={showEditGoalModal ? editForm.data.title : data.title}
                                        onChange={e => showEditGoalModal ? editForm.setData('title', e.target.value) : setData('title', e.target.value)}
                                        placeholder="e.g. Become a Senior Developer"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 font-black text-lg outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-200"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">The Strategic Blueprint</label>
                                    <textarea 
                                        value={showEditGoalModal ? editForm.data.description : data.description}
                                        onChange={e => showEditGoalModal ? editForm.setData('description', e.target.value) : setData('description', e.target.value)}
                                        placeholder="Define the high-level intent..." 
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all h-20 resize-none placeholder:text-slate-200"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Field</label>
                                        <select 
                                            value={showEditGoalModal ? editForm.data.category_id : data.category_id}
                                            onChange={e => showEditGoalModal ? editForm.setData('category_id', e.target.value) : setData('category_id', e.target.value)}
                                            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 font-black text-[10px] uppercase tracking-widest outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                                        >
                                            <option value="">Field</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ambition</label>
                                        <select 
                                            value={showEditGoalModal ? editForm.data.priority_id : data.priority_id}
                                            onChange={e => showEditGoalModal ? editForm.setData('priority_id', e.target.value) : setData('priority_id', e.target.value)}
                                            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 font-black text-[10px] uppercase tracking-widest outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                                        >
                                            {priorities.map(prio => <option key={prio.id} value={prio.id}>{prio.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target</label>
                                        <input 
                                            type="date" 
                                            value={showEditGoalModal ? editForm.data.target_date : data.target_date}
                                            onChange={e => showEditGoalModal ? editForm.setData('target_date', e.target.value) : setData('target_date', e.target.value)}
                                            className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 font-black text-[10px] outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex space-x-4">
                                    <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200 active:scale-95">
                                        {showEditGoalModal ? 'Refine Blueprint' : 'Launch Vision'}
                                    </button>
                                    {showEditGoalModal && (
                                        <button 
                                            type="button" 
                                            onClick={() => deleteGoal(selectedGoal)} 
                                            className="w-16 bg-rose-50 text-rose-500 flex items-center justify-center rounded-2xl hover:bg-rose-500 hover:text-white transition-all border-2 border-white shadow-xl shadow-rose-100 active:scale-95"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}

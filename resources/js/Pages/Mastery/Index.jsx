import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, CheckCircle2, Trash2, Edit3, ChevronRight, Compass, TrendingUp, Check, MapPin } from 'lucide-react';

export default function Index({ goals, categories, priorities }) {
    const [localGoals, setLocalGoals] = useState(goals.data || []);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showEditGoalModal, setShowEditGoalModal] = useState(false);

    useEffect(() => {
        if (goals.current_page > 1) {
            setLocalGoals(prev => {
                const newItems = goals.data.filter(item => !prev.some(p => p.id === item.id));
                return [...prev, ...newItems];
            });
        } else {
            setLocalGoals(goals.data || []);
        }
    }, [goals]);

    // Initialize or keep selected goal in sync
    useEffect(() => {
        if (localGoals.length > 0) {
            if (!selectedGoal) {
                setSelectedGoal(localGoals[0]);
            } else {
                const updated = localGoals.find(g => g.id === selectedGoal.id);
                if (updated) setSelectedGoal(updated);
                else setSelectedGoal(localGoals[0]);
            }
        } else {
            setSelectedGoal(null);
        }
    }, [localGoals]);

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
                onSuccess: () => setSelectedGoal(localGoals[0] || null),
            });
        }
    };

    const loadMore = () => {
        if (!goals.next_page_url) return;
        router.visit(goals.next_page_url, {
            only: ['goals'],
            preserveState: true,
            preserveScroll: true,
        });
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
                                <p className="text-2xl font-black text-slate-900 leading-none">{goals.total || localGoals.length}</p>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl shadow-slate-100 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                                <p className="text-2xl font-black text-emerald-600 leading-none">{localGoals.filter(g => calculateProgress(g) === 100).length}</p>
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

                {localGoals.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-24 px-6 text-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[3rem] flex flex-col items-center justify-center"
                    >
                        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-emerald-500 mb-6">
                            <Target size={40} strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">No Vision Defined</h3>
                        <p className="text-slate-500 font-medium text-sm max-w-sm mb-8 mx-auto">
                            Your master backlog is empty. Define your first long-term vision and break it down into actionable milestones.
                        </p>
                        <button 
                            onClick={() => setShowGoalModal(true)}
                            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-slate-200 hover:shadow-emerald-200 active:scale-95"
                        >
                            <Plus size={16} strokeWidth={3} />
                            <span>Launch New Vision</span>
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Vision Cards Carousel */}
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {localGoals.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setSelectedGoal(goal)}
                                    className={`snap-center shrink-0 w-72 p-6 rounded-[2.5rem] border-2 text-left transition-all ${
                                        selectedGoal?.id === goal.id 
                                        ? 'border-emerald-500 shadow-xl shadow-emerald-100/50 bg-emerald-50/30' 
                                        : 'border-slate-100 shadow-lg shadow-slate-100/50 bg-white hover:border-emerald-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                            selectedGoal?.id === goal.id ? 'bg-emerald-500 text-white shadow-inner' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                            <Target size={24} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</span>
                                            <p className={`font-black text-lg leading-none mt-1 ${selectedGoal?.id === goal.id ? 'text-emerald-500' : 'text-slate-800'}`}>
                                                {calculateProgress(goal)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                            selectedGoal?.id === goal.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {goal.category?.name || 'Vision'}
                                        </div>
                                    </div>
                                    <h3 className="font-black text-xl text-slate-800 tracking-tighter leading-tight mb-4 line-clamp-2">
                                        {goal.title}
                                    </h3>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-auto">
                                        <motion.div 
                                            className={`h-full rounded-full ${selectedGoal?.id === goal.id ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${calculateProgress(goal)}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </button>
                            ))}
                            {goals.next_page_url && (
                                <button
                                    onClick={loadMore}
                                    className="snap-center shrink-0 w-32 p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-lg shadow-slate-100/50 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-100 text-slate-400 flex flex-col items-center justify-center transition-all group active:scale-95"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm group-hover:bg-emerald-100 group-hover:text-emerald-600">
                                        <ChevronRight size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Load More</span>
                                </button>
                            )}
                        </div>

                        {/* Mastery Track Panel */}
                        <AnimatePresence mode="wait">
                            {selectedGoal && (
                                <motion.div 
                                    key={selectedGoal.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10"
                                >
                                    <div className="flex flex-col md:flex-row gap-10">
                                        {/* Left: Info */}
                                        <div className="md:w-1/3">
                                            <div className="bg-slate-50 rounded-[2rem] p-6 h-full flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-4">
                                                        <MapPin size={16} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context</span>
                                                    </div>
                                                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight mb-4">{selectedGoal.title}</h2>
                                                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                                                        "{selectedGoal.description || 'No description provided.'}"
                                                    </p>
                                                </div>
                                                <div className="mt-8 flex items-center gap-3">
                                                    <button 
                                                        onClick={() => openEditModal(selectedGoal)} 
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95"
                                                    >
                                                        <Edit3 size={14} />
                                                        <span>Refine Vision</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteGoal(selectedGoal)} 
                                                        title="Delete Vision"
                                                        className="w-11 h-11 shrink-0 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Timeline */}
                                        <div className="md:w-2/3">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center space-x-2">
                                                    <TrendingUp size={16} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mastery Track</span>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                                    {selectedGoal.milestones?.filter(m => m.is_completed).length || 0} / {selectedGoal.milestones?.length || 0} Steps
                                                </span>
                                            </div>

                                            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
                                                {(selectedGoal.milestones || []).map((ms, index) => (
                                                    <div key={ms.id} className="relative group">
                                                        {/* Timeline Node */}
                                                        <button 
                                                            onClick={() => toggleMilestone(ms.id)}
                                                            className={`absolute -left-[30px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-[6px] border-white transition-colors z-10 ${
                                                                ms.is_completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 group-hover:bg-emerald-300 text-transparent'
                                                            }`}
                                                        >
                                                            <Check size={12} strokeWidth={4} className={ms.is_completed ? 'opacity-100' : 'opacity-0'} />
                                                        </button>

                                                        <div className="pl-4">
                                                            <button 
                                                                onClick={() => toggleMilestone(ms.id)}
                                                                className={`block w-full text-left p-4 rounded-2xl transition-all ${
                                                                    ms.is_completed ? 'bg-emerald-50/50 opacity-60' : 'bg-slate-50 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                <div className="relative inline-block">
                                                                    <span className={`text-sm font-bold transition-colors ${ms.is_completed ? 'text-slate-500' : 'text-slate-800'}`}>
                                                                        {ms.title}
                                                                    </span>
                                                                    <motion.div 
                                                                        initial={false}
                                                                        animate={{ width: ms.is_completed ? '100%' : '0%' }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="absolute left-0 top-1/2 h-0.5 bg-slate-500 -translate-y-1/2 rounded-full"
                                                                        style={{ originX: 0 }}
                                                                    />
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {/* Add Node Form */}
                                                <div className="relative pt-4">
                                                    <div className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border-[4px] border-white flex items-center justify-center text-slate-400 z-10">
                                                        <Plus size={12} strokeWidth={4} />
                                                    </div>
                                                    <div className="pl-4">
                                                        <form onSubmit={addMilestone}>
                                                            <div className="relative flex items-center">
                                                                <input 
                                                                    type="text" 
                                                                    value={milestoneForm.data.title}
                                                                    onChange={e => milestoneForm.setData('title', e.target.value)}
                                                                    placeholder="Add next milestone..."
                                                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-5 pr-14 py-4 text-sm font-bold focus:border-emerald-500 focus:ring-0 transition-all outline-none"
                                                                />
                                                                <button 
                                                                    type="submit" 
                                                                    disabled={!milestoneForm.data.title.trim() || milestoneForm.processing}
                                                                    className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm hover:bg-emerald-600 active:scale-95"
                                                                >
                                                                    <Plus size={20} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
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
                            className="relative w-full max-w-lg bg-white rounded-[3.5rem] p-10 border-4 border-white shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {showEditGoalModal ? 'Refine Vision' : 'New Vision'}<span className="text-emerald-500">.</span>
                                </h2>
                                <button onClick={() => { setShowGoalModal(false); setShowEditGoalModal(false); }} type="button" className="w-10 h-10 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all group shadow-sm shrink-0">
                                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>

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
                                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200 active:scale-95">
                                        {showEditGoalModal ? 'Refine Blueprint' : 'Launch Vision'}
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

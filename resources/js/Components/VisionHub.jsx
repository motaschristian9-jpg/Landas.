import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Calendar, AlertCircle, Plus, CheckCircle2, MoreHorizontal, Trash2, ChevronRight } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

export default function VisionHub({ goals }) {
    const [expandedGoal, setExpandedGoal] = useState(null);
    const { post, patch, delete: destroy, data, setData, processing } = useForm({
        title: ''
    });

    const addMilestone = (e, goalId) => {
        e.preventDefault();
        post(route('goals.milestones.store', goalId), {
            onSuccess: () => setData('title', ''),
            preserveScroll: true
        });
    };

    const toggleMilestone = (goalId, milestoneId) => {
        patch(route('goals.milestones.toggle', [goalId, milestoneId]), {
            preserveScroll: true
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Long-term Vision</h2>
                    <div className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                        {goals.length} Active
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {goals.map((goal) => (
                    <motion.div
                        key={goal.id}
                        layout
                        className={`bg-white rounded-[3rem] border-2 transition-all overflow-hidden ${
                            expandedGoal === goal.id 
                            ? 'border-emerald-500 shadow-2xl shadow-emerald-50' 
                            : 'border-slate-100 shadow-xl shadow-slate-100/50 hover:border-emerald-200'
                        }`}
                    >
                        <div 
                            className="p-8 cursor-pointer flex items-center justify-between"
                            onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                        >
                            <div className="flex items-center space-x-4 md:space-x-6">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[1.75rem] flex items-center justify-center transition-all shrink-0 ${
                                    goal.is_at_risk ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white'
                                }`}>
                                    {goal.is_at_risk ? <AlertCircle size={24} className="md:size-32" /> : <Target size={24} className="md:size-32" strokeWidth={2.5} />}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-xl md:text-2xl text-slate-800 tracking-tighter leading-tight truncate">
                                        {goal.title}
                                    </h3>
                                    <div className="flex items-center mt-1 space-x-4">
                                        <div className="flex items-center text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
                                            <TrendingUp size={10} className="mr-1 md:size-12" />
                                            {goal.progress}%
                                        </div>
                                        <div className="flex items-center text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
                                            <CheckCircle2 size={10} className="mr-1 md:size-12" />
                                            {goal.completed_milestones}/{goal.milestones_count}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 md:space-x-6 shrink-0">
                                <div className="w-24 md:w-48 h-2 md:h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner block sm:block">
                                    <motion.div 
                                        className={`h-full rounded-full ${goal.is_at_risk ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${expandedGoal === goal.id ? 'rotate-90 bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                                    <ChevronRight size={20} strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedGoal === goal.id && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-8 pb-8 border-t border-slate-50 pt-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Milestone List */}
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Launch Checklist</p>
                                            <div className="space-y-2">
                                                {/* This would need milestones data passed from controller if not already included */}
                                                {/* For now, we assume the controller will be updated or we use a sub-fetch */}
                                                {/* Actually, let's assume goal.milestones is available */}
                                                {(goal.milestones || []).map(ms => (
                                                    <div 
                                                        key={ms.id}
                                                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <button 
                                                                onClick={() => toggleMilestone(goal.id, ms.id)}
                                                                className={ms.is_completed ? 'text-emerald-500' : 'text-slate-200'}
                                                            >
                                                                <CheckCircle2 size={20} fill={ms.is_completed ? 'currentColor' : 'none'} />
                                                            </button>
                                                            <span className={`text-sm font-bold ${ms.is_completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                                                                {ms.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <form onSubmit={(e) => addMilestone(e, goal.id)} className="mt-4">
                                                    <div className="relative">
                                                        <input 
                                                            type="text" 
                                                            value={data.title}
                                                            onChange={e => setData('title', e.target.value)}
                                                            placeholder="Add new milestone..."
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-emerald-500 focus:ring-0 transition-all outline-none"
                                                        />
                                                        <button type="submit" className="absolute right-2 top-2 bg-emerald-500 text-white p-2 rounded-xl">
                                                            <Plus size={16} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        {/* Goal Info */}
                                        <div className="bg-slate-50/50 rounded-[2rem] p-6">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Context</p>
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                                                "{goal.description || 'No description provided.'}"
                                            </p>
                                            <div className="mt-6 flex items-center space-x-4">
                                                <Link href={route('goals.edit', goal.id)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                    Edit Vision
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {goals.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <p className="text-slate-300 font-black italic">No missions defined yet.</p>
                        <Link href={route('goals.create')} className="mt-4 inline-block bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
                            Launch New Vision
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

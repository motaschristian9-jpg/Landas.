import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';

export default function Index({ todos }) {
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        due_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('todos.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const toggleTodo = (todo) => {
        router.put(route('todos.update', todo.id), {
            is_completed: !todo.is_completed
        }, {
            preserveScroll: true,
        });
    };

    const deleteTodo = (todo) => {
        if (confirm(`Are you sure you want to delete '${todo.title}'?`)) {
            router.delete(route('todos.destroy', todo.id));
        }
    };

    const completedCount = todos.filter(t => t.is_completed).length;
    const totalCount = todos.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Daily Tasks" />

            <div className="relative">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-3">Daily Tasks<span className="text-emerald-500">.</span></h1>
                        <p className="text-slate-400 font-bold text-base">Small steps, every day. Focus on what matters now.</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-8 py-4 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95 group"
                        >
                            <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M12 4v16m8-8H4"/></svg>
                            Add New Task
                        </button>
                    </div>
                </div>

                {todos.length === 0 ? (
                    <div className="bg-white/60 backdrop-blur-md rounded-[3rem] border-4 border-white p-16 text-center relative overflow-hidden group shadow-[0_32px_64px_-12px_rgba(0,0,0,0.02)]">
                        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] opacity-60"></div>
                        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative shadow-inner">
                            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter leading-none">All clear for today!</h3>
                        <p className="text-slate-400 mb-10 max-w-sm mx-auto font-bold text-base leading-relaxed">Your to-do list is empty. Take a break or plan your next move.</p>
                        <button onClick={() => setShowModal(true)} className="inline-flex items-center bg-slate-800 hover:bg-black text-white font-black py-5 px-12 rounded-[1.5rem] transition-all active:scale-95 group shadow-xl shadow-slate-200">
                            Create First Task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Status Bento Box (1x2) */}
                        <div className="md:col-span-1 md:row-span-2 bg-slate-800 rounded-[3rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-slate-200 animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-8 -translate-y-8 blur-2xl"></div>
                            <div>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                </div>
                                <h3 className="text-xl font-black tracking-tight mb-2">Focus Score</h3>
                                <p className="text-slate-400 text-xs font-bold leading-relaxed">You've completed <span className="text-emerald-400">{completedCount}</span> out of <span className="text-white">{totalCount}</span> tasks today.</p>
                            </div>
                            <div className="mt-8">
                                <span className="text-6xl font-black tracking-tighter text-emerald-400">
                                    {percentage}<span className="text-2xl opacity-40">%</span>
                                </span>
                                <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] mt-2">Daily Momentum</p>
                            </div>
                        </div>

                        {/* Tasks Grid (3x2) */}
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {todos.map((todo) => (
                                <div key={todo.id} className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border-2 border-white p-7 hover:bg-white hover:shadow-[0_32px_64px_-12px_rgba(16,185,129,0.08)] transition-all duration-700 group relative flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <button 
                                                onClick={() => toggleTodo(todo)}
                                                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${todo.is_completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'border-slate-100 bg-white text-transparent hover:border-emerald-300'}`}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7"/></svg>
                                            </button>
                                            <div>
                                                <h3 className={`text-lg font-black tracking-tighter leading-tight ${todo.is_completed ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                                                    {todo.title}
                                                </h3>
                                                {todo.due_date && (
                                                    <div className="flex items-center text-slate-400 font-black text-[8px] uppercase tracking-[0.2em] mt-1">
                                                        {new Date(todo.due_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => deleteTodo(todo)}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Creation Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>

                            <div className="relative transform overflow-hidden rounded-[3rem] bg-white/90 backdrop-blur-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border-4 border-white animate-in zoom-in-95 duration-300">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">New Task<span className="text-emerald-500">.</span></h2>
                                            <p className="text-slate-400 font-bold text-xs mt-1">What needs to be done?</p>
                                        </div>
                                    </div>
                                    <form onSubmit={submit}>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Task Title</label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    placeholder="e.g., Drink water, Call mom" 
                                                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm shadow-sm"
                                                />
                                                {errors.title && <p className="text-rose-500 text-[10px] font-bold mt-2 ml-1">{errors.title}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Due Date (Optional)</label>
                                                <input 
                                                    type="date" 
                                                    value={data.due_date}
                                                    onChange={e => setData('due_date', e.target.value)}
                                                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm shadow-sm"
                                                />
                                            </div>
                                            <div className="pt-6 flex space-x-3">
                                                <button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-200/50 transition-all transform active:scale-95 text-xs uppercase tracking-widest"
                                                >
                                                    Add Task
                                                </button>
                                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 bg-white/50 hover:bg-white text-slate-400 font-black rounded-xl transition-all text-xs uppercase tracking-widest border border-slate-100 shadow-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

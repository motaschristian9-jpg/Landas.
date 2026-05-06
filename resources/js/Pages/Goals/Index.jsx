import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';

export default function Index({ goals, categories, priorities }) {
    const { auth, query = {} } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editGoalData, setEditGoalData] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category_id: '',
        priority_id: '2', // Default to medium/standard
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

    const openEditModal = (goal) => {
        setEditGoalData(goal);
        editForm.setData({
            title: goal.title || '',
            description: goal.description || '',
            category_id: goal.category_id || '',
            priority_id: goal.priority_id || '',
            target_date: goal.target_date || '',
            status: goal.status || '',
        });
        setShowEditModal(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('goals.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('goals.update', editGoalData.id), {
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    const handleDelete = (goal) => {
        if (confirm(`Are you sure you want to delete '${goal.title}'?`)) {
            router.delete(route('goals.destroy', goal.id));
        }
    };

    const handleFilter = (name, value) => {
        const newQuery = { ...query, [name]: value };
        if (!value) delete newQuery[name];
        router.get(route('goals.index'), newQuery, { preserveState: true });
    };

    const totalGoals = goals.total;
    const completedCount = goals.data.filter(g => g.status === 'completed').length; // This is only for current page, but the hero wants global. 
    // Actually, I should probably pass global stats from controller if I want accuracy in the hero.
    // For now, I'll just use the ones I can or assume they are passed.
    
    return (
        <AuthenticatedLayout>
            <Head title="My Goals" />

            <div className="relative">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-none mb-3">My Goals</h1>
                        <p className="text-slate-400 font-bold text-lg">Your roadmap to excellence.</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center bg-slate-800 hover:bg-black text-white font-black py-4 px-10 rounded-[1.5rem] transition-all active:scale-95 group shadow-xl shadow-slate-200"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 4v16m8-8H4"/></svg>
                        Create New Goal
                    </button>
                </div>

                {goals.total === 0 && !query.search && !query.status ? (
                    <div className="bg-white rounded-[3rem] border-4 border-slate-50 p-16 text-center relative overflow-hidden group shadow-2xl shadow-slate-100">
                        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] opacity-60"></div>
                        <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative shadow-inner">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl animate-bounce shadow-lg shadow-emerald-200"></div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter leading-none">Your journey starts here.</h3>
                        <p className="text-slate-400 mb-10 max-w-sm mx-auto font-bold text-base leading-relaxed">No goals yet? Let's fix that! Dream big and start tracking today.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center bg-slate-800 hover:bg-black text-white font-black py-5 px-12 rounded-[1.5rem] transition-all active:scale-95 group shadow-xl shadow-slate-200"
                        >
                            Create First Goal
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Vision Summary Hero */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-100 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <div className="flex items-center space-x-3 mb-6 opacity-80">
                                        <div className="w-8 h-[2px] bg-white rounded-full"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Vision</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Tracking <span className="text-emerald-200">{goals.total}</span> milestones</h2>
                                    <p className="text-emerald-50 font-bold text-base max-w-sm leading-relaxed opacity-90">Filter, search, and manage your progress with our high-performance command table.</p>
                                </div>

                                <div className="flex items-center space-x-12">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-emerald-200/60 uppercase tracking-widest mb-2">Total</p>
                                        <p className="text-4xl font-black text-white">{goals.total}</p>
                                    </div>
                                    <div className="w-[1px] h-12 bg-white/10"></div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-emerald-200/60 uppercase tracking-widest mb-2">Page Results</p>
                                        <p className="text-4xl font-black text-white">{goals.data.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bento Table Container */}
                        <div className="bg-white/60 backdrop-blur-md rounded-[3rem] border-4 border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.02)] overflow-hidden">
                            {/* Toolbar */}
                            <div className="p-8 border-b border-slate-50 bg-white/40">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative flex-grow">
                                        <input 
                                            type="text" 
                                            placeholder="Search goals..." 
                                            defaultValue={query.search || ''}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter('search', e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-300 transition-all"
                                        />
                                        <svg className="absolute left-4 top-4 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="3"/></svg>
                                    </div>

                                    {/* Filters */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <select 
                                            value={query.status || ''}
                                            onChange={(e) => handleFilter('status', e.target.value)}
                                            className="bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-wider text-slate-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                                        >
                                            <option value="">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>

                                        <select 
                                            value={query.sort || 'latest'}
                                            onChange={(e) => handleFilter('sort', e.target.value)}
                                            className="bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-black uppercase tracking-wider text-slate-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                                        >
                                            <option value="latest">Latest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="deadline">By Deadline</option>
                                        </select>

                                        {(query.search || query.status || query.sort) && (
                                            <Link href={route('goals.index')} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors" title="Clear Filters">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Table Content */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Goal Details</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Priority</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Deadline</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {goals.data.map((goal) => (
                                            <tr key={goal.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-emerald-500 transition-all shadow-sm">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-slate-800 tracking-tight mb-0.5 group-hover:text-emerald-600 transition-colors">{goal.title}</h4>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goal.category?.name || 'Growth'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {goal.priority ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 bg-white shadow-sm" style={{ color: goal.priority.color }}>
                                                            <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: goal.priority.color }}></span>
                                                            {goal.priority.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-200">—</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                                        goal.status === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                                                        goal.status === 'in_progress' ? 'bg-amber-400 text-white shadow-amber-100' : 
                                                        'bg-white text-slate-400 border border-slate-100'
                                                    }`}>
                                                        {goal.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[11px] font-black text-slate-700 tracking-tight">
                                                            {goal.target_date ? new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Open'}
                                                        </span>
                                                        {goal.target_date && (
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">
                                                                {/* Simple human-readable date logic would go here */}
                                                                Deadline
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button 
                                                            onClick={() => openEditModal(goal)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(goal)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm active:scale-95"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {goals.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                            <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                                        </div>
                                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No goals found matching your filters.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination (Simplified for now) */}
                            {goals.links.length > 3 && (
                                <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center space-x-2">
                                    {goals.links.map((link, i) => (
                                        <Link 
                                            key={i}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                                link.active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 
                                                link.url ? 'bg-white text-slate-400 hover:bg-slate-50' : 'text-slate-200 cursor-default'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modals (Create and Edit) */}
                {(showModal || showEditModal) && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setShowModal(false); setShowEditModal(false); }}></div>
                            
                            <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white/90 backdrop-blur-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-4 border-white animate-in zoom-in-95 duration-300">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{showEditModal ? 'Edit' : 'New'} Goal<span className="text-emerald-500">.</span></h2>
                                            <p className="text-slate-400 font-bold text-xs mt-1">{showEditModal ? 'Refine your vision.' : 'Ready for your next challenge?'}</p>
                                        </div>
                                        <button onClick={() => { setShowModal(false); setShowEditModal(false); }} className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all group shadow-sm">
                                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                                        </button>
                                    </div>

                                    <form onSubmit={showEditModal ? submitEdit : submitCreate}>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Goal Title <span className="text-emerald-500">*</span></label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    value={showEditModal ? editForm.data.title : data.title}
                                                    onChange={e => showEditModal ? editForm.setData('title', e.target.value) : setData('title', e.target.value)}
                                                    placeholder="e.g., Learn Laravel 12" 
                                                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm shadow-sm"
                                                />
                                                {(showEditModal ? editForm.errors.title : errors.title) && <p className="text-rose-500 text-[10px] font-bold mt-2 ml-1">{showEditModal ? editForm.errors.title : errors.title}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Description</label>
                                                <textarea 
                                                    rows="2" 
                                                    value={showEditModal ? editForm.data.description : data.description}
                                                    onChange={e => showEditModal ? editForm.setData('description', e.target.value) : setData('description', e.target.value)}
                                                    placeholder="What exactly do you want to achieve?"
                                                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm shadow-sm"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Category</label>
                                                    <select 
                                                        value={showEditModal ? editForm.data.category_id : data.category_id}
                                                        onChange={e => showEditModal ? editForm.setData('category_id', e.target.value) : setData('category_id', e.target.value)}
                                                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm appearance-none shadow-sm"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Priority</label>
                                                    <select 
                                                        value={showEditModal ? editForm.data.priority_id : data.priority_id}
                                                        onChange={e => showEditModal ? editForm.setData('priority_id', e.target.value) : setData('priority_id', e.target.value)}
                                                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm appearance-none shadow-sm"
                                                    >
                                                        {priorities.map(prio => <option key={prio.id} value={prio.id}>{prio.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Target Date</label>
                                                    <input 
                                                        type="date" 
                                                        value={showEditModal ? editForm.data.target_date : data.target_date}
                                                        onChange={e => showEditModal ? editForm.setData('target_date', e.target.value) : setData('target_date', e.target.value)}
                                                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm shadow-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Status</label>
                                                    <select 
                                                        value={showEditModal ? editForm.data.status : data.status}
                                                        onChange={e => showEditModal ? editForm.setData('status', e.target.value) : setData('status', e.target.value)}
                                                        className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-700 text-sm appearance-none shadow-sm"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-6 flex space-x-3">
                                                <button 
                                                    type="submit" 
                                                    disabled={processing || editForm.processing}
                                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-200/50 transition-all transform active:scale-95 text-xs uppercase tracking-widest"
                                                >
                                                    {showEditModal ? 'Update' : 'Launch'} Goal
                                                </button>
                                                <button type="button" onClick={() => { setShowModal(false); setShowEditModal(false); }} className="px-8 py-4 bg-white/50 hover:bg-white text-slate-400 font-black rounded-xl transition-all text-xs uppercase tracking-widest border border-slate-100 shadow-sm">
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

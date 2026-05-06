import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ goal }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Goal: ${goal.title}`} />

            <div className="pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10">
                    <Link href={route('goals.index')} className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] hover:translate-x-[-4px] transition-transform inline-flex items-center">
                        ← Back to Journey
                    </Link>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-[4rem] p-12 border-4 border-white shadow-2xl shadow-slate-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <svg className="w-64 h-64 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">{goal.category?.name || 'Uncategorized'}</span>
                            <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">{goal.priority?.name || 'Standard'} Priority</span>
                        </div>

                        <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-tight mb-6">{goal.title}</h1>
                        
                        <div className="max-w-2xl">
                            <p className="text-xl font-bold text-slate-400 leading-relaxed mb-12">
                                {goal.description || 'No description provided for this milestone.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 rounded-[2.5rem] p-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
                                <p className="text-2xl font-black text-slate-800 uppercase tracking-tight">{goal.status.replace('_', ' ')}</p>
                            </div>
                            <div className="bg-slate-50 rounded-[2.5rem] p-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deadline</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight">{goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'Open'}</p>
                            </div>
                            <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100">
                                <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-2">Creation Date</p>
                                <p className="text-2xl font-black tracking-tight">{new Date(goal.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

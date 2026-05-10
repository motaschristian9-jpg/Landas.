import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Check, User } from 'lucide-react';

export default function CompleteGoogleProfile({ googleUser }) {
    const { data, setData, post, processing } = useForm({
        use_google_name: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('auth.google.complete'));
    };

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const displayName = data.use_google_name ? googleUser.name : (googleUser.email.split('@')[0]);

    return (
        <GuestLayout>
            <Head title="Complete Profile" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-2 transition-colors duration-500">One Last Step<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Confirm your display name</p>
            </div>

            <div className="flex justify-center mb-10">
                <div className="relative">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white text-4xl font-black border-4 border-white dark:border-slate-800 shadow-2xl transition-all duration-500 transform hover:rotate-3">
                        {getInitial(displayName)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-800 dark:bg-white text-white dark:text-slate-800 p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-slate-800">
                        <Check size={16} strokeWidth={3} />
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => setData('use_google_name', !data.use_google_name)}
                        className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all ${
                            data.use_google_name 
                            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-50 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl transition-colors ${data.use_google_name ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <User size={20} strokeWidth={2.5} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Identity</p>
                                <p className="text-sm font-bold">{data.use_google_name ? googleUser.name : (googleUser.email.split('@')[0])}</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            data.use_google_name ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700'
                        }`}>
                            {data.use_google_name && <Check size={14} strokeWidth={4} />}
                        </div>
                    </button>
                </div>


                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50"
                >
                    {processing ? 'Launching...' : 'Enter Landas'}
                </button>
            </form>
        </GuestLayout>
    );
}

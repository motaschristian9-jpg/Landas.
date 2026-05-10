import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { AlertCircle, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';

export default function VerifyGoogleLink({ email }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('auth.google.verify'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Ownership" />

            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-2">Secure Link<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Verify your password for <span className="text-emerald-500">{email}</span></p>
            </div>

            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-2 border-amber-100 dark:border-amber-900/20 text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                We found an existing account with this email. Please verify your password once to securely link your Google account.
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                            <Lock size={20} strokeWidth={2.5} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full pl-12 pr-12 py-4 rounded-[1.5rem] border-2 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm ${
                                errors.password ? 'border-red-100 dark:border-red-900/30 focus:border-red-200 focus:ring-red-500/5' : 'border-slate-50 dark:border-slate-800 focus:border-emerald-500/20 focus:ring-emerald-500/5'
                            }`}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                            <AlertCircle size={10} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">{errors.password}</span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50"
                >
                    {processing ? 'Verifying...' : 'Confirm & Link Account'}
                </button>

                <div className="text-center pt-4">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-emerald-500 transition-colors group"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

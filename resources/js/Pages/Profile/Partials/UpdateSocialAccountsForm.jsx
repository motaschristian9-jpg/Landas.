import React from 'react';
import { usePage } from '@inertiajs/react';
import { Check, ShieldCheck, Mail, Link as LinkIcon, ExternalLink } from 'lucide-react';

export default function UpdateSocialAccountsForm() {
    const user = usePage().props.auth.user;
    const isGoogleLinked = !!user.google_id;

    return (
        <section className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <LinkIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Connected Accounts</h2>
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                    Manage your linked social accounts for easier access to Landas.
                </p>
            </header>

            <div className="space-y-4">
                <div className={`p-6 rounded-[2rem] border-4 transition-all duration-500 ${
                    isGoogleLinked 
                    ? 'bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-50 dark:border-emerald-900/20' 
                    : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-50 dark:border-slate-800'
                }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path
                                        fill="#EA4335"
                                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M16.04 18.013c-1.09.696-2.47 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067C3.186 21.35 7.283 24 12 24c3.117 0 5.934-1.118 8.034-3.04l-3.994-2.947Z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M19.832 20.96c2.02-1.926 3.253-4.72 3.253-7.96 0-.812-.073-1.624-.21-2.413H12v4.57h6.357c-.274 1.481-1.113 2.738-2.31 3.562l3.785 3.24Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.795.137-1.557.368-2.268L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">Google Account</h3>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {isGoogleLinked ? 'Linked and protected' : 'Not connected'}
                                </p>
                            </div>
                        </div>

                        {isGoogleLinked ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck size={14} />
                                Linked
                            </div>
                        ) : (
                            <a
                                href={route('auth.google.link')}
                                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-emerald-500 hover:text-white border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                            >
                                <ExternalLink size={14} />
                                Link Google
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

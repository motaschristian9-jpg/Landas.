import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function InvalidToken() {
    return (
        <>
            <Head title="Invalid Reset Link" />

            <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border-2 border-red-100">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tighter mb-2">Expired Link<span className="text-red-500">.</span></h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">This path is no longer valid</p>
            </div>

            <div className="mb-8 px-2 text-center">
                <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                    Oops! It looks like this password reset link has either expired or has already been used. Please request a new link to continue.
                </p>
            </div>

            <div className="space-y-4">
                <Link
                    href={route('password.request')}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-center text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 transition-all block transform active:scale-95"
                >
                    Request New Link
                </Link>

                <div className="text-center pt-2">
                    <Link
                        href={route('login')}
                        tabIndex="-1"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors group"
                    >
                        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </>
    );
}

InvalidToken.layout = page => <GuestLayout children={page} />;

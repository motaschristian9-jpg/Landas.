import { Head, Link, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GuestLayout from '@/Layouts/GuestLayout';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword({ status }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (values) => {
        if (isSubmitting) return;

        router.post(route('password.email'), values, {
            onError: (serverErrors) => {
                Object.keys(serverErrors).forEach((key) => {
                    setError(key, { type: 'server', message: serverErrors[key] });
                });
            },
        });
    };

    const ErrorMessage = ({ message }) => {
        return (
            <div 
                className="flex items-center gap-1.5 mt-1 ml-1 text-red-500 min-h-[14px]"
                style={{ visibility: message ? 'visible' : 'hidden' }}
            >
                <AlertCircle size={10} />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                    {message || "Placeholder"}
                </span>
            </div>
        );
    };

    return (
        <>
            <Head title="Reset Your Path" />

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-sm font-bold text-emerald-600">
                    {status}
                </div>
            )}

            <div className="mb-4 text-center">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tighter mb-1">Reset Path<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">We'll help you find your way back</p>
            </div>

            <div className="mb-6 px-1 text-center">
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                    Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="your@email.com"
                            className={`w-full pl-12 pr-5 py-3 rounded-[1.5rem] border-2 bg-slate-50/50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm shadow-sm ${
                                errors.email ? 'border-red-100 focus:border-red-200 focus:ring-red-500/5' : 'border-slate-50 focus:border-emerald-500/20 focus:ring-emerald-500/5'
                            }`}
                        />
                    </div>
                    <ErrorMessage message={errors.email?.message} />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Sending Link...' : 'Email Reset Link'}
                </button>

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
            </form>
        </>
    );
}

ForgotPassword.layout = page => <GuestLayout children={page} />;

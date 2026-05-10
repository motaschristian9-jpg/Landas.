import { Head, Link, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import GoogleButton from '@/Components/GoogleButton';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    remember: z.boolean().optional(),
});

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const onSubmit = (values) => {
        if (isSubmitting) return;

        router.post(route('login'), values, {
            onError: (serverErrors) => {
                Object.keys(serverErrors).forEach((key) => {
                    setError(key, { type: 'server', message: serverErrors[key] });
                });
            },
        });
    };

    // Static error component - no animations
    const ErrorMessage = ({ message }) => {
        return (
            <div 
                className="flex items-center gap-1.5 mt-1.5 ml-1 text-red-500 min-h-[14px]"
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
            <Head title="Welcome Back" />

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/20 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <div className="mb-6 text-center">
                <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-2 transition-colors duration-500">Welcome Back<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Sign in to continue your path</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="your@email.com"
                            className={`w-full pl-12 pr-5 py-4 rounded-[1.5rem] border-2 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm ${
                                errors.email ? 'border-red-100 dark:border-red-900/30 focus:border-red-200 focus:ring-red-500/5' : 'border-slate-50 dark:border-slate-800 focus:border-emerald-500/20 focus:ring-emerald-500/5'
                            }`}
                        />
                    </div>
                    <ErrorMessage message={errors.email?.message} />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-12 py-4 rounded-[1.5rem] border-2 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm ${
                                errors.password ? 'border-red-100 dark:border-red-900/30 focus:border-red-200 focus:ring-red-500/5' : 'border-slate-50 dark:border-slate-800 focus:border-emerald-500/20 focus:ring-emerald-500/5'
                            }`}
                        />
                        <button
                            type="button"
                            tabIndex="-1"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <ErrorMessage message={errors.password?.message} />
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            {...register('remember')}
                            tabIndex="-1"
                            className="rounded-lg border-2 border-slate-100 dark:border-slate-800 text-emerald-500 focus:ring-emerald-500/20 w-5 h-5 transition-all dark:bg-slate-900"
                        />
                        <span className="ms-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            tabIndex="-1"
                            className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Verifying...' : 'Sign In'}
                </button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em] text-slate-400">
                        <span className="bg-white dark:bg-[#0a0a0a] px-4">or Continue with</span>
                    </div>
                </div>

                <GoogleButton />

                <div className="text-center pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        New to Landas?{' '}
                        <Link
                            href={route('register')}
                            tabIndex="-1"
                            className="text-emerald-500 hover:text-emerald-600 transition-colors underline decoration-2 underline-offset-4"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}

Login.layout = page => <GuestLayout children={page} />;




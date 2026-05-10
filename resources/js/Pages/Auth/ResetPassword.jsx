import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GuestLayout from '@/Layouts/GuestLayout';
import { AlertCircle, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const resetPasswordSchema = z.object({
    token: z.string(),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            token: token,
            email: email,
            password: '',
            password_confirmation: '',
        },
    });

    const onSubmit = (values) => {
        if (isSubmitting) return;

        router.post(route('password.store'), values, {
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
            <Head title="Set Your New Password" />

            <div className="mb-6 text-center">
                <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-2">Secure Path<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Choose a strong new password</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <input type="hidden" {...register('token')} />

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Email Address</label>
                    <div className="relative group opacity-60">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"/></svg>
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            readOnly
                            className="w-full pl-12 pr-5 py-4 rounded-[1.5rem] border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 outline-none font-bold text-slate-500 dark:text-slate-400 text-sm shadow-sm"
                        />
                    </div>
                    <ErrorMessage message={errors.email?.message} />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                            <Lock className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-12 py-4 rounded-[1.5rem] border-2 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm ${
                                errors.password ? 'border-red-100 dark:border-red-900/50 focus:border-red-200 focus:ring-red-500/5' : 'border-slate-50 dark:border-slate-800 focus:border-emerald-500/20 focus:ring-emerald-500/5'
                            }`}
                        />
                        <button
                            type="button"
                            tabIndex="-1"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <ErrorMessage message={errors.password?.message} />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Confirm New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                            <Lock className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <input
                            {...register('password_confirmation')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-12 py-4 rounded-[1.5rem] border-2 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm ${
                                errors.password_confirmation ? 'border-red-100 dark:border-red-900/50 focus:border-red-200 focus:ring-red-500/5' : 'border-slate-50 dark:border-slate-800 focus:border-emerald-500/20 focus:ring-emerald-500/5'
                            }`}
                        />
                        <button
                            type="button"
                            tabIndex="-1"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <ErrorMessage message={errors.password_confirmation?.message} />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Updating...' : 'Reset Password'}
                </button>
            </form>
        </>
    );
}

ResetPassword.layout = page => <GuestLayout children={page} />;

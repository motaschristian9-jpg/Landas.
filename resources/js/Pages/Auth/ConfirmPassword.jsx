import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-2">Secure Area<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Confirm your identity to proceed</p>
            </div>

            <div className="mb-8 px-1 text-center">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    This is a secure area of the application. Please confirm your
                    password before continuing.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoFocus
                            className={`w-full pl-12 pr-5 py-4 rounded-[1.5rem] border-2 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm shadow-sm ${
                                errors.password ? 'border-red-100 dark:border-red-900/30 focus:border-red-200' : 'border-slate-50 dark:border-slate-800 focus:border-emerald-500/20'
                            }`}
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50"
                >
                    {processing ? 'Confirming...' : 'Confirm'}
                </button>
            </form>
        </GuestLayout>
    );
}

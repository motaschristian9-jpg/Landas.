import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tighter mb-2">Check your Mail<span className="text-emerald-500">.</span></h2>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Verify your path to continue</p>
            </div>

            <div className="mb-8 px-1 text-center">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just emailed to
                    you? If you didn't receive the email, we will gladly send you
                    another.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/20 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-emerald-200/50 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

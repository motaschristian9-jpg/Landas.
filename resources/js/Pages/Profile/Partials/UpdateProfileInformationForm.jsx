import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-[1.5px] bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Identity</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                    Profile Information
                </h2>

                <p className="text-xs font-bold text-slate-400 mt-1">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-8">
                <div className="space-y-2 group/field">
                    <InputLabel htmlFor="name" value="Full Name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/field:text-emerald-500 transition-colors" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full !rounded-2xl !border-slate-100 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 focus:!ring-emerald-500/20 focus:!border-emerald-500 !py-4 transition-all"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="space-y-2 group/field">
                    <InputLabel htmlFor="email" value="Email Address" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/field:text-emerald-500 transition-colors" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full !rounded-2xl !border-slate-100 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 dark:text-white focus:!ring-emerald-500/20 focus:!border-emerald-500 !py-4 transition-all"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-2 border-amber-100 dark:border-amber-900/30">
                        <p className="text-sm font-bold text-amber-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 rounded-md text-sm text-amber-600 underline hover:text-amber-900 focus:outline-none"
                            >
                                Re-send verification link.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-bold text-emerald-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center space-x-6 pt-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-slate-900 dark:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 disabled:opacity-50"
                    >
                        Save Changes
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center space-x-2 text-emerald-500">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Saved Successfully</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

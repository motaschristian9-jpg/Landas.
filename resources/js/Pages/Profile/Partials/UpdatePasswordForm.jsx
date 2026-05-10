import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-6 h-[1.5px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            {user.has_password ? 'Update Password' : 'Set Account Password'}
                        </h2>
                    </div>
                    
                    {!user.has_password && (
                        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Social Login Active</span>
                        </div>
                    )}
                </div>

                <p className="text-xs font-bold text-slate-400 mt-2">
                    {user.has_password 
                        ? 'Ensure your account is using a long, random password to stay secure.'
                        : 'Your account is linked with Google. You can set a password here to enable email login.'}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-8">
                {user.has_password && (
                    <div className="space-y-2 group/field">
                        <InputLabel
                            htmlFor="current_password"
                            value="Current Password"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/field:text-emerald-500 transition-colors"
                        />

                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full !rounded-2xl !border-slate-100 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 focus:!ring-emerald-500/20 focus:!border-emerald-500 !py-4 transition-all"
                            autoComplete="current-password"
                        />

                        <InputError
                            message={errors.current_password}
                            className="mt-2"
                        />
                    </div>
                )}

                <div className="space-y-2 group/field">
                    <InputLabel htmlFor="password" value="New Password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/field:text-emerald-500 transition-colors" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full !rounded-2xl !border-slate-100 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 focus:!ring-emerald-500/20 focus:!border-emerald-500 !py-4 transition-all"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-2 group/field">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within/field:text-emerald-500 transition-colors"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full !rounded-2xl !border-slate-100 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900/50 focus:!ring-emerald-500/20 focus:!border-emerald-500 !py-4 transition-all"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center space-x-6 pt-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-slate-900 dark:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 disabled:opacity-50"
                    >
                        {user.has_password ? 'Update Key' : 'Create Key'}
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
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {user.has_password ? 'Password Updated' : 'Password Created'}
                            </span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

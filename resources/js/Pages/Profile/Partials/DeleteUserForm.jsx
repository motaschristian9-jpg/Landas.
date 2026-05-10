import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: (errors) => {
                if (passwordInput.current) {
                    passwordInput.current.focus();
                }
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-[1.5px] bg-rose-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Danger Zone</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                    Delete Account
                </h2>

                <p className="text-xs font-bold text-slate-400 mt-1 max-w-xl">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <button 
                onClick={confirmUserDeletion}
                className="bg-rose-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 dark:shadow-none active:scale-95"
            >
                Permanently Delete Account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-rose-50 dark:bg-rose-900/10 text-rose-500 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"></path></svg>
                        </div>

                        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none mb-4">
                            Are you absolutely sure?
                        </h2>

                        <p className="text-slate-400 font-bold text-base leading-relaxed mb-8">
                            This action is irreversible. All your data will be purged. <br/>
                            Please type <span className="text-rose-500 font-black">DELETE MY ACCOUNT</span> to confirm.
                        </p>

                        <div className="w-full mb-8">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="sr-only"
                            />

                            <TextInput
                                id="password"
                                type="text"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="block w-full !rounded-2xl !border-slate-100 dark:!border-slate-800 !bg-slate-50/50 dark:!bg-slate-900 focus:!ring-rose-500/20 focus:!border-rose-500 !py-4 transition-all text-center"
                                isFocused
                                placeholder="DELETE MY ACCOUNT"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex w-full space-x-4">
                            <button 
                                type="button"
                                onClick={closeModal}
                                className="flex-1 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={processing || data.password !== 'DELETE MY ACCOUNT'}
                                className="flex-1 py-5 rounded-[1.5rem] bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                            >
                                Delete Everything
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

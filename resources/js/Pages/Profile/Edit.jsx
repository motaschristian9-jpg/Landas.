import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="pt-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-[2px] bg-emerald-500 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Settings</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter leading-none mb-3">Profile Settings<span className="text-emerald-500">.</span></h1>
                    <p className="text-slate-400 font-bold text-lg">Manage your identity, security, and account preferences.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-7 bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border-4 border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="xl:col-span-5 bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border-4 border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                        <UpdatePasswordForm />
                    </div>

                    <div className="xl:col-span-12 bg-rose-50/20 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border-4 border-white shadow-xl shadow-rose-100/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

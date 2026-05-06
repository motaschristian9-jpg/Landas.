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
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-none mb-3">Profile Settings<span className="text-emerald-500">.</span></h1>
                    <p className="text-slate-400 font-bold text-lg">Manage your identity and security.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-10 border-4 border-white shadow-xl shadow-slate-100/50">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-10 border-4 border-white shadow-xl shadow-slate-100/50">
                        <UpdatePasswordForm />
                    </div>

                    <div className="lg:col-span-2 bg-rose-50/30 backdrop-blur-md rounded-[3rem] p-10 border-4 border-white shadow-xl shadow-rose-100/20">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

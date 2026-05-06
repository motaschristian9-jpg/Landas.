import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash, errors } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') !== 'false'
    );
    const [userMenu, setUserMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    
    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    // Confirmation Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger',
        action: null,
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }, [sidebarCollapsed]);

    useEffect(() => {
        if (flash?.success) {
            triggerToast(flash.success, 'success');
        }
        if (flash?.error) {
            triggerToast(flash.error, 'error');
        }
    }, [flash]);

    const triggerToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    };

    const showConfirm = (options) => {
        setConfirmModal({
            isOpen: true,
            title: options.title || 'Are you sure?',
            message: options.message || 'This action cannot be undone.',
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            type: options.type || 'danger',
            action: options.action,
        });
    };

    const executeConfirmAction = () => {
        if (confirmModal.action) {
            confirmModal.action();
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="flex min-h-screen mesh-gradient text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-6 transition-all duration-500 transform">
                    <div className={`rounded-[2rem] p-5 shadow-2xl flex items-center border-4 border-white/10 backdrop-blur-xl ${
                        toast.type === 'success' ? 'bg-slate-800 shadow-slate-900/20' : 'bg-rose-600 shadow-rose-900/20'
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 ${
                            toast.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'
                        }`}>
                            {toast.type === 'success' ? (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7"/></svg>
                            ) : (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M6 18L18 6M6 6l12 12"/></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-black tracking-tight text-[10px] uppercase tracking-[0.2em] opacity-50 mb-0.5">
                                {toast.type === 'success' ? 'Success' : 'Error'}
                            </p>
                            <p className="text-white font-bold tracking-tight text-sm leading-tight">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-4 text-white/30 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside 
                className={`hidden md:flex flex-col bg-white/40 backdrop-blur-xl border-r border-white sticky top-0 h-screen transition-all duration-500 ease-in-out z-50 group ${sidebarCollapsed ? 'w-24' : 'w-72'}`}
            >
                <div className={`p-6 mb-4 flex items-center overflow-hidden ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <Link href={route('dashboard')} className="flex items-center space-x-3 group/logo">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover/logo:rotate-12 transition-transform duration-500 shrink-0">
                            <div className="w-6 h-6 bg-white rounded-lg"></div>
                        </div>
                        {!sidebarCollapsed && (
                            <span className="text-2xl font-black text-slate-800 tracking-tight whitespace-nowrap transition-all duration-300">
                                Landas<span className="text-emerald-500">.</span>
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <div className="mb-4">
                        {!sidebarCollapsed && <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>}
                        
                        <Link href={route('dashboard')} 
                           className={`flex items-center p-3 rounded-2xl transition-all group/item ${route().current('dashboard') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}>
                            <div className="shrink-0 transition-transform group-hover/item:scale-110">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            </div>
                            {!sidebarCollapsed && <span className="ml-4 font-black text-sm uppercase tracking-widest whitespace-nowrap">Dashboard</span>}
                        </Link>

                        <Link href={route('goals.index')} 
                           className={`flex items-center p-3 rounded-2xl transition-all group/item mt-2 ${route().current('goals.*') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}>
                            <div className="shrink-0 transition-transform group-hover/item:scale-110">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            {!sidebarCollapsed && <span className="ml-4 font-black text-sm uppercase tracking-widest whitespace-nowrap">My Goals</span>}
                        </Link>

                        {/* Note: todos route might need adjustment based on availability */}
                        <Link href={route('todos.index')} 
                           className={`flex items-center p-3 rounded-2xl transition-all group/item mt-2 ${route().current('todos.*') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'} ${sidebarCollapsed ? 'justify-center' : ''}`}>
                            <div className="shrink-0 transition-transform group-hover/item:scale-110">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                            </div>
                            {!sidebarCollapsed && <span className="ml-4 font-black text-sm uppercase tracking-widest whitespace-nowrap">Daily Tasks</span>}
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/50">
                    <div className="relative">
                        <button onClick={() => setUserMenu(!userMenu)} 
                                className={`flex items-center w-full p-2 bg-slate-50 rounded-2xl text-slate-700 hover:bg-emerald-50 transition-all focus:outline-none group/user ${sidebarCollapsed ? 'justify-center pr-2' : 'pr-5'}`}>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100 group-hover/user:scale-105 transition-transform shrink-0">
                                {auth.user.name.charAt(0)}
                            </div>
                            {!sidebarCollapsed && <span className="ml-4 font-bold text-sm text-slate-600 truncate">{auth.user.name}</span>}
                        </button>
                        
                        {userMenu && (
                            <div className="absolute bottom-full left-0 mb-4 w-64 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                <div className="px-4 py-3 mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Settings</p>
                                </div>
                                <Link href={route('profile.edit')} className="flex items-center px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all rounded-2xl group/item">
                                    <div className="p-2 bg-slate-50 rounded-xl mr-3 group-hover/item:bg-emerald-100 transition-colors">
                                        <svg className="w-4 h-4 text-slate-400 group-hover/item:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    My Profile
                                </Link>
                                <button 
                                    onClick={() => showConfirm({
                                        title: 'Sign Out?',
                                        message: 'Are you sure you want to end your session?',
                                        confirmText: 'Sign Out',
                                        type: 'warning',
                                        action: () => router.post(route('logout'))
                                    })}
                                    className="flex items-center w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all rounded-2xl group/item">
                                    <div className="p-2 bg-red-50/50 rounded-xl mr-3 group-hover/item:bg-red-100 transition-colors">
                                        <svg className="w-4 h-4 text-red-400 group-hover/item:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                            className="mt-4 w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                        <svg className={`w-5 h-5 transition-transform duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <nav className="md:hidden bg-white/40 backdrop-blur-xl border-b border-white py-4 px-6 flex justify-between items-center sticky top-0 z-[60] w-full">
                <Link href={route('dashboard')} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                        <div className="w-5 h-5 bg-white rounded-lg"></div>
                    </div>
                    <span className="text-xl font-black text-slate-800 tracking-tight">Landas<span className="text-emerald-500">.</span></span>
                </Link>
                <button onClick={() => setMobileMenu(!mobileMenu)} className="text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                {mobileMenu && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-4 shadow-2xl z-[70] animate-in slide-in-from-top">
                        <Link href={route('dashboard')} className="block text-slate-600 font-bold hover:text-emerald-600 transition-colors">Dashboard</Link>
                        <Link href={route('goals.index')} className="block text-slate-600 font-bold hover:text-emerald-600 transition-colors">My Goals</Link>
                        <Link href={route('todos.index')} className="block text-slate-600 font-bold hover:text-emerald-600 transition-colors">Daily Tasks</Link>
                        <hr className="border-slate-100" />
                        <Link href={route('profile.edit')} className="block text-slate-600 font-bold">Profile</Link>
                        <button 
                            onClick={() => showConfirm({
                                title: 'Sign Out?',
                                message: 'Ready to leave?',
                                confirmText: 'Sign Out',
                                type: 'warning',
                                action: () => router.post(route('logout'))
                            })}
                            className="block w-full text-left text-red-600 font-bold">Sign Out</button>
                    </div>
                )}
            </nav>

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>
            </div>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="relative z-[300]">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-[3rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border-4 border-white animate-in zoom-in-95 duration-300">
                                <div className="p-10">
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 ${
                                            confirmModal.type === 'danger' ? 'bg-rose-50 text-rose-500' : 
                                            confirmModal.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                                            'bg-amber-50 text-amber-500'
                                        }`}>
                                            {confirmModal.type === 'danger' && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"></path></svg>}
                                            {confirmModal.type === 'warning' && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                                            {confirmModal.type === 'success' && <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M5 13l4 4L19 7"></path></svg>}
                                        </div>
                                        
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-4">{confirmModal.title}</h3>
                                        <p className="text-slate-400 font-bold text-base leading-relaxed mb-10">{confirmModal.message}</p>
                                        
                                        <div className="flex w-full space-x-4">
                                            <button onClick={executeConfirmAction} 
                                                    className={`flex-1 py-5 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                                                        confirmModal.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' :
                                                        confirmModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' :
                                                        'bg-amber-500 hover:bg-amber-600 shadow-amber-100'
                                                    }`}>
                                                {confirmModal.confirmText}
                                            </button>
                                            <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                                                    className="flex-1 py-5 rounded-[1.5rem] bg-slate-50 hover:bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest transition-all">
                                                {confirmModal.cancelText}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

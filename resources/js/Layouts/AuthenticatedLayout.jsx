import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import CommandPalette from '@/Components/CommandPalette';
import { LayoutDashboard, ListTodo, Flame, Trophy, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTimerModal from '@/Components/FocusTimerModal';
import { useFocusTimer } from '@/Contexts/FocusTimerContext';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash, errors } = usePage().props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved !== null ? saved === 'true' : true;
        }
        return true;
    });
    const [userMenu, setUserMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    
    const { activeTask, isMinimized, timeRemaining, toggleMinimize } = useFocusTimer();

    const formatTime = (ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
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
        <div className="flex flex-col md:flex-row min-h-screen mesh-gradient dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-500">
            <CommandPalette />
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
                className={`hidden md:flex flex-col bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border-r border-white dark:border-slate-800 sticky top-0 h-screen transition-all duration-500 ease-in-out z-50 group hide-scrollbar ${sidebarCollapsed ? 'w-24' : 'w-72'}`}
            >
                {/* Logo Section */}
                <div className="h-24 flex items-center border-b border-white/50 dark:border-slate-800/50 relative overflow-hidden">
                    <div className={`flex items-center transition-all duration-500 w-full ${sidebarCollapsed ? 'px-0 justify-center' : 'px-6'}`}>
                        <Link href={route('dashboard')} className="flex items-center group/logo shrink-0">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-none group-hover/logo:rotate-12 transition-transform duration-500 shrink-0">
                                <div className="w-6 h-6 bg-white rounded-lg"></div>
                            </div>
                            <span className={`text-2xl font-black text-slate-800 dark:text-white tracking-tight whitespace-nowrap transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0 ml-0 pointer-events-none' : 'opacity-100 max-w-xs ml-3'}`}>
                                Landas<span className="text-emerald-500">.</span>
                            </span>
                        </Link>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto hide-scrollbar pt-4">
                    <p className={`text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 whitespace-nowrap transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0 mb-0 h-0' : 'opacity-100 max-w-xs mb-4 h-auto'}`}>
                        Main Menu
                    </p>
                    
                    {/* Dashboard */}
                    <Link href={route('dashboard')} 
                        className={`flex items-center h-14 rounded-2xl transition-all duration-500 group/item relative overflow-hidden ${route().current('dashboard') ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200/50 dark:shadow-none' : 'text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>
                        <div className="w-16 h-14 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </div>
                        <span className={`font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-xs ml-0'}`}>Dashboard</span>
                    </Link>

                    {/* Execution */}
                    <Link href={route('todos.index')} 
                        className={`flex items-center h-14 rounded-2xl transition-all duration-500 group/item relative overflow-hidden ${route().current('todos.*') ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200/50 dark:shadow-none' : 'text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>
                        <div className="w-16 h-14 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        </div>
                        <span className={`font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-xs ml-0'}`}>Daily Sprint</span>
                    </Link>

                    {/* Discipline */}
                    <Link href={route('habits.index')} 
                        className={`flex items-center h-14 rounded-2xl transition-all duration-500 group/item relative overflow-hidden ${route().current('habits.*') ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200/50 dark:shadow-none' : 'text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>
                        <div className="w-16 h-14 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z"></path></svg>
                        </div>
                        <span className={`font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-xs ml-0'}`}>Daily Discipline</span>
                    </Link>

                    {/* Vision */}
                    <Link href={route('mastery.index')} 
                        className={`flex items-center h-14 rounded-2xl transition-all duration-500 group/item relative overflow-hidden ${route().current('mastery.*') ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200/50 dark:shadow-none' : 'text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>
                        <div className="w-16 h-14 shrink-0 flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <span className={`font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-xs ml-0'}`}>Vision Hub</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/50 dark:border-slate-800/50">
                    <div className="relative">
                        <button onClick={() => setUserMenu(!userMenu)} 
                                className={`flex items-center w-full h-14 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-500 focus:outline-none group/user overflow-hidden ${sidebarCollapsed ? 'justify-center' : 'px-2'}`}>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100 dark:shadow-none group-hover/user:scale-105 transition-transform shrink-0">
                                {auth.user.name.charAt(0)}
                            </div>
                            <span className={`font-bold text-sm text-slate-600 truncate transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 max-w-0 ml-0 pointer-events-none' : 'opacity-100 max-w-xs ml-4'}`}>{auth.user.name}</span>
                        </button>
                        
                        {userMenu && (
                            <div className="absolute bottom-full left-0 mb-4 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                <div className="px-4 py-3 mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Settings</p>
                                </div>
                                <Link href={route('profile.edit')} className="flex items-center px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all rounded-2xl group/item">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mr-3 group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/40 transition-colors">
                                        <svg className="w-4 h-4 text-slate-400 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
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
                                    className="flex items-center w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-2xl group/item">
                                    <div className="p-2 bg-red-50/50 dark:bg-red-900/20 rounded-xl mr-3 group-hover/item:bg-red-100 dark:group-hover/item:bg-red-900/40 transition-colors">
                                        <svg className="w-4 h-4 text-red-400 group-hover/item:text-red-600 dark:group-hover/item:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                            className="mt-4 w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-all">
                        <svg className={`w-5 h-5 transition-transform duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <nav className="md:hidden bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white dark:border-slate-800 py-4 px-6 flex justify-between items-center sticky top-0 z-[60] w-full">
                <Link href={route('dashboard')} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none">
                        <div className="w-5 h-5 bg-white rounded-lg"></div>
                    </div>
                    <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Landas<span className="text-emerald-500">.</span></span>
                </Link>
                
                <button 
                    onClick={() => setUserMenu(!userMenu)}
                    className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100 dark:shadow-none active:scale-90 transition-transform"
                >
                    {auth.user.name.charAt(0)}
                </button>

                <AnimatePresence mode="wait">
                    {userMenu && (
                        <div key="mobile-user-menu-wrapper" className="md:hidden">
                            <motion.div 
                                key="user-menu-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setUserMenu(false)}
                                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[70]"
                            />
                            <motion.div 
                                key="user-menu-modal"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                className="absolute top-full right-6 mt-4 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-[80] overflow-hidden"
                            >
                                <div className="px-5 py-4 mb-2">
                                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate">{auth.user.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <Link href={route('profile.edit')} className="flex items-center px-5 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all rounded-[1.5rem] group/item">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mr-4 group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/40 transition-colors">
                                            <User size={18} className="text-slate-400 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400" />
                                        </div>
                                        My Profile
                                    </Link>
                                    <button 
                                        onClick={() => showConfirm({
                                            title: 'Sign Out?',
                                            message: 'Ready to end your session?',
                                            confirmText: 'Sign Out',
                                            type: 'warning',
                                            action: () => router.post(route('logout'))
                                        })}
                                        className="flex items-center w-full text-left px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-[1.5rem] group/item"
                                    >
                                        <div className="p-2 bg-red-50/50 dark:bg-red-900/20 rounded-xl mr-4 group-hover/item:bg-red-100 dark:group-hover/item:bg-red-900/40 transition-colors">
                                            <LogOut size={18} className="text-red-400 group-hover/item:text-red-600" />
                                        </div>
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8">
                <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl shadow-slate-900/40 border border-white/10">
                    <Link 
                        href={route('dashboard')}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[1.8rem] transition-all relative ${route().current('dashboard') ? 'text-white' : 'text-slate-500'}`}
                    >
                        {route().current('dashboard') && (
                            <motion.div layoutId="mobile-nav-pill" className="absolute inset-0 bg-emerald-500 rounded-[1.8rem] z-0" />
                        )}
                        <LayoutDashboard size={20} className="relative z-10" />
                        <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 relative z-10 ${route().current('dashboard') ? 'opacity-100' : 'opacity-40'}`}>Home</span>
                    </Link>

                    <Link 
                        href={route('todos.index')}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[1.8rem] transition-all relative ${route().current('todos.*') ? 'text-white' : 'text-slate-500'}`}
                    >
                        {route().current('todos.*') && (
                            <motion.div layoutId="mobile-nav-pill" className="absolute inset-0 bg-emerald-500 rounded-[1.8rem] z-0" />
                        )}
                        <ListTodo size={20} className="relative z-10" />
                        <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 relative z-10 ${route().current('todos.*') ? 'opacity-100' : 'opacity-40'}`}>Sprint</span>
                    </Link>

                    <Link 
                        href={route('habits.index')}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[1.8rem] transition-all relative ${route().current('habits.*') ? 'text-white' : 'text-slate-500'}`}
                    >
                        {route().current('habits.*') && (
                            <motion.div layoutId="mobile-nav-pill" className="absolute inset-0 bg-emerald-500 rounded-[1.8rem] z-0" />
                        )}
                        <Flame size={20} className="relative z-10" />
                        <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 relative z-10 ${route().current('habits.*') ? 'opacity-100' : 'opacity-40'}`}>Discipline</span>
                    </Link>

                    <Link 
                        href={route('mastery.index')}
                        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-[1.8rem] transition-all relative ${route().current('mastery.*') ? 'text-white' : 'text-slate-500'}`}
                    >
                        {route().current('mastery.*') && (
                            <motion.div layoutId="mobile-nav-pill" className="absolute inset-0 bg-emerald-500 rounded-[1.8rem] z-0" />
                        )}
                        <Trophy size={20} className="relative z-10" />
                        <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 relative z-10 ${route().current('mastery.*') ? 'opacity-100' : 'opacity-40'}`}>Vision</span>
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex flex-col min-h-0 w-full relative">
                {activeTask && isMinimized && (
                    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                        <button 
                            onClick={toggleMinimize}
                            className="flex items-center space-x-2 bg-slate-900 text-emerald-400 px-4 py-2 rounded-2xl font-mono font-bold shadow-2xl border border-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{formatTime(timeRemaining)}</span>
                        </button>
                    </div>
                )}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
                    {children}
                </main>
            </div>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="relative z-[300]">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border-4 border-white dark:border-slate-800 animate-in zoom-in-95 duration-300">
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
                                        
                                        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none mb-4">{confirmModal.title}</h3>
                                        <p className="text-slate-400 dark:text-slate-500 font-bold text-base leading-relaxed mb-10">{confirmModal.message}</p>
                                        
                                        <div className="flex w-full space-x-4">
                                            <button onClick={executeConfirmAction} 
                                                    className={`flex-1 py-5 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                                                        confirmModal.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100 dark:shadow-none' :
                                                        confirmModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100 dark:shadow-none' :
                                                        'bg-amber-500 hover:bg-amber-600 shadow-amber-100 dark:shadow-none'
                                                    }`}>
                                                {confirmModal.confirmText}
                                            </button>
                                            <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                                                    className="flex-1 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest transition-all">
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
            
            <FocusTimerModal />
        </div>
    );
}

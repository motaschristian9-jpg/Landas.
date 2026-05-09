import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmationModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger" // danger, warning, success
}) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                                    type === 'danger' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'
                                }`}>
                                    <AlertCircle size={28} strokeWidth={2.5} />
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-300 dark:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed mb-10">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                                        type === 'danger' 
                                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-100 dark:shadow-none' 
                                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100 dark:shadow-none'
                                    }`}
                                >
                                    {confirmText}
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 border-2 border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function PathCompanion({ guidance }) {
    const [isDismissing, setIsDismissing] = useState(false);

    if (!guidance || guidance.acknowledged_at) return null;

    const handleAcknowledge = () => {
        setIsDismissing(true);
        router.post(route('guidance.acknowledge', guidance.id), {}, {
            preserveScroll: true,
            onSuccess: () => setIsDismissing(false)
        });
    };

    return (
        <AnimatePresence>
            {!isDismissing && (
                <motion.div 
                    initial={{ y: -20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.95 }}
                    className="relative z-40 mb-12"
                >
                    {/* The Floating Island */}
                    <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-emerald-100/50 dark:border-emerald-900/30 rounded-[3rem] p-1 px-1 shadow-2xl shadow-emerald-100/20 dark:shadow-none group">
                        
                        {/* Decorative Background Glow */}
                        <div className="absolute -inset-24 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
                        
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 md:px-12">
                            
                            <div className="flex items-center space-x-8">
                                {/* The Icon/Avatar */}
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-inner relative overflow-hidden">
                                        <Sparkles size={28} strokeWidth={2.5} className="relative z-10 animate-pulse" />
                                        <motion.div 
                                            className="absolute inset-0 bg-emerald-200/20"
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 animate-bounce shadow-sm"></div>
                                </div>
                                
                                <div className="max-w-xl">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500/60 leading-none">Guidance from</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">Path</span>
                                    </div>
                                    <p className="font-bold text-xl md:text-2xl tracking-tight text-slate-800 dark:text-slate-200 leading-[1.2]">
                                        {guidance.message}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={handleAcknowledge}
                                    className="bg-slate-900 dark:bg-emerald-500 text-white px-10 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200 dark:hover:shadow-none transition-all active:scale-95 flex items-center group/btn whitespace-nowrap"
                                >
                                    <span>Thank you, Path</span>
                                    <ChevronRight className="ml-3 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Subtle Progress Line at bottom */}
                        <motion.div 
                            className="absolute bottom-0 left-0 h-1 bg-emerald-500/20 w-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

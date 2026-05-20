import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

const routeIndexMap = {
    'register': 0,
    'login': 1,
    'password.request': 2,
    'password.reset': 3,
};

export default function GuestLayout({ children }) {
    const { url } = usePage();
    const currentRoute = route().current();
    
    // Track previous route to determine direction immediately
    const [prevRoute, setPrevRoute] = useState(currentRoute);
    
    const currentIndex = routeIndexMap[currentRoute] ?? 1;
    const previousIndex = routeIndexMap[prevRoute] ?? 1;

    // Direction: 1 for Forward (Slides Left), -1 for Backward (Slides Right)
    const direction = useMemo(() => {
        if (currentIndex === previousIndex) return 0;
        return currentIndex > previousIndex ? 1 : -1;
    }, [currentIndex, previousIndex]);

    useEffect(() => {
        if (currentRoute !== prevRoute) {
            setPrevRoute(currentRoute);
        }
    }, [currentRoute, prevRoute]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 200 : -200,
            rotateY: direction > 0 ? 25 : -25,
            opacity: 0,
            filter: 'blur(10px)',
            scale: 0.95
        }),
        center: {
            x: 0,
            rotateY: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1
        },
        exit: (direction) => ({
            x: direction > 0 ? -200 : 200,
            rotateY: direction > 0 ? -25 : 25,
            opacity: 0,
            filter: 'blur(10px)',
            scale: 0.95
        })
    };

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500">
            {/* Left Side: Brand & Motto (60%) */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden md:flex md:w-[60%] bg-white dark:bg-slate-900 relative items-center justify-center p-20 overflow-hidden"
            >
                {/* Refined Mesh Gradient for White Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]"></div>
                
                <div className="relative z-10">
                    <motion.div 
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl dark:shadow-none border-2 border-slate-50 dark:border-slate-700 mb-12 cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <div className="w-5 h-5 bg-white rounded-md"></div>
                        </div>
                    </motion.div>
                    
                    <h1 className="text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tighter leading-tight mb-4">
                        Define your<br />
                        <span className="text-emerald-500 drop-shadow-sm">Destiny.</span>
                    </h1>
                    
                    <div className="flex items-center gap-3 mb-20">
                        <div className="h-[1px] w-8 bg-slate-200 dark:bg-slate-800"></div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Landas Productivity</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 max-w-lg">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 group cursor-default"
                        >
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                <Target size={20} />
                            </div>
                            <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Focused Goals</p>
                        </motion.div>
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 group cursor-default"
                        >
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                <Zap size={20} />
                            </div>
                            <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Rapid Tasks</p>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 p-10 opacity-[0.03] dark:opacity-[0.05]">
                    <p className="text-[140px] font-black text-slate-900 dark:text-white leading-none tracking-tighter select-none">LANDAS</p>
                </div>
            </motion.div>

            {/* Right Side: Auth Forms (40%) */}
            <div className="flex-1 md:w-[40%] flex flex-col bg-white dark:bg-slate-950 p-6 md:p-10 relative overflow-hidden transition-colors duration-500">
                <div className="md:hidden flex justify-center mb-6">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <div className="w-6 h-6 bg-white rounded-md"></div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative" style={{ perspective: '1200px' }}>
                    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                        <motion.div 
                            key={url}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ 
                                x: { type: "spring", stiffness: 350, damping: 35 },
                                opacity: { duration: 0.25 },
                                rotateY: { duration: 0.4 },
                                scale: { duration: 0.4 }
                            }}
                            className="w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 text-center md:text-left">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em]">
                        © {new Date().getFullYear()} Landas Productivity Systems
                    </p>
                </div>
            </div>
        </div>
    );
}



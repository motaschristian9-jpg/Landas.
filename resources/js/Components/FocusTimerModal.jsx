import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Minus, Maximize2, Minimize2, CheckCircle2, Coffee, Plus } from 'lucide-react';
import { useFocusTimer } from '@/Contexts/FocusTimerContext';
import { router } from '@inertiajs/react';

export default function FocusTimerModal() {
    const { 
        activeTask, timeRemaining, isPaused, isFinished, isMinimized,
        pauseTimer, resumeTimer, stopTimer, toggleMinimize, addTime
    } = useFocusTimer();
    
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Sync fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            if (containerRef.current?.requestFullscreen) {
                try {
                    await containerRef.current.requestFullscreen();
                } catch (e) {
                    console.log('Fullscreen request failed', e);
                }
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        }
    };

    const handleMinimize = async () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
        }
        toggleMinimize();
    };

    const handleQuit = async () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
        }
        stopTimer();
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleComplete = async () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
        }
        if (activeTask) {
            router.put(route('todos.update', activeTask.id), {}, {
                preserveScroll: true,
                onSuccess: () => stopTimer()
            });
        }
    };

    // Make sure we only render when there is an active task and it's not minimized
    if (!activeTask || isMinimized) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 text-white"
            >
                <div className="absolute top-6 right-6 flex items-center space-x-6 z-[110]">
                    <button onClick={toggleFullscreen} className="text-slate-400 hover:text-white transition-colors" title="Toggle Fullscreen">
                        {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                    </button>
                    <button onClick={handleMinimize} className="text-slate-400 hover:text-white transition-colors" title="Minimize">
                        <Minus size={28} />
                    </button>
                    <button onClick={handleQuit} className="text-slate-400 hover:text-rose-400 transition-colors" title="Quit Timer">
                        <X size={28} />
                    </button>
                </div>

                <div className="text-center max-w-4xl px-6 w-full">
                    <motion.div 
                        key="time"
                        className={`font-black tracking-tighter leading-none ${isFinished ? 'text-rose-400' : 'text-emerald-400'}`}
                        style={{ fontSize: 'clamp(6rem, 15vw, 15rem)', fontFamily: '"Inter", sans-serif' }}
                        layout
                    >
                        {formatTime(timeRemaining)}
                    </motion.div>

                    <h2 className="text-2xl md:text-4xl font-bold text-slate-300 mt-8 mb-16">
                        {activeTask.title}
                    </h2>

                    {!isFinished ? (
                        <div className="flex items-center justify-center space-x-6">
                            {isPaused ? (
                                <button 
                                    onClick={resumeTimer}
                                    className="flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-5 rounded-3xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 text-xl"
                                >
                                    <Play size={24} className="fill-current" />
                                    <span>Resume</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={pauseTimer}
                                    className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 text-slate-300 px-10 py-5 rounded-3xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-slate-700 text-xl"
                                >
                                    <Pause size={24} className="fill-current" />
                                    <span>Pause</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button 
                                onClick={handleComplete}
                                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                            >
                                <CheckCircle2 size={24} />
                                <span>Complete Task</span>
                            </button>
                            <button 
                                onClick={() => addTime(5)}
                                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-slate-700 w-full sm:w-auto"
                            >
                                <Coffee size={24} />
                                <span>Take 5m Break</span>
                            </button>
                            <button 
                                onClick={() => addTime(5)}
                                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border border-slate-700 w-full sm:w-auto"
                            >
                                <Plus size={24} />
                                <span>Add 5 Mins</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

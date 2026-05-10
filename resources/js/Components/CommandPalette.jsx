import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router, Link } from '@inertiajs/react';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Mock/Static actions for now - will be expanded
    const actions = [
        { id: 'dash', title: 'Go to Dashboard', icon: '🏠', url: route('dashboard') },
        { id: 'goals', title: 'View All Goals', icon: '🎯', url: route('goals.index') },
        { id: 'todos', title: 'Daily Tasks', icon: '✅', url: route('todos.index') },
        { id: 'profile', title: 'Profile Settings', icon: '👤', url: route('profile.edit') },
        { id: 'new-goal', title: 'Create New Goal', icon: '➕', action: () => router.get(route('goals.index'), { openModal: true }) },
    ];

    const filteredActions = actions.filter(a => 
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (action) => {
        setIsOpen(false);
        if (action.url) {
            router.get(action.url);
        } else if (action.action) {
            action.action();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border-2 border-white dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                            <div className="text-emerald-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input 
                                ref={inputRef}
                                type="text"
                                placeholder="Search actions or type a command..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
                                    } else if (e.key === 'Enter') {
                                        handleSelect(filteredActions[selectedIndex]);
                                    }
                                }}
                                className="w-full bg-transparent border-none focus:ring-0 text-xl font-black text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 tracking-tight"
                            />
                            <div className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Esc</span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                            <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Suggestions</p>
                            {filteredActions.length > 0 ? filteredActions.map((action, index) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleSelect(action)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group ${selectedIndex === index ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${selectedIndex === index ? 'bg-white/20' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform'}`}>
                                            {action.icon}
                                        </div>
                                        <span className={`text-sm font-black tracking-tight ${selectedIndex === index ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {action.title}
                                        </span>
                                    </div>
                                    {selectedIndex === index && (
                                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest opacity-70">
                                            <span>Press</span>
                                            <span className="px-1.5 py-0.5 bg-white/20 rounded">Enter</span>
                                        </div>
                                    )}
                                </button>
                            )) : (
                                <div className="py-12 text-center">
                                    <p className="text-slate-400 font-bold tracking-tight italic">No matches found for "{search}"</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-black text-slate-400 dark:text-slate-500 shadow-sm">↑↓</kbd>
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Navigate</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-black text-slate-400 dark:text-slate-500 shadow-sm">↵</kbd>
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Landas Nexus v1.0</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, router } from "@inertiajs/react";
import {
    CheckCircle2,
    Circle,
    Clock,
    ChevronRight,
    Zap,
    Star,
    Trash2,
    Play,
} from "lucide-react";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useFocusTimer } from "@/Contexts/FocusTimerContext";

export default function TaskShelf({ todos, nextUrl, onLoadMore }) {

    const [todoToDelete, setTodoToDelete] = React.useState(null);
    const { startTimer, activeTask } = useFocusTimer();

    const handleToggle = (todo) => {
        router.put(
            route("todos.update", todo.id),
            {
                is_completed: !todo.is_completed,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (todo) => {
        setTodoToDelete(todo);
    };

    const confirmDelete = () => {
        if (todoToDelete) {
            router.delete(route("todos.destroy", todoToDelete.id), {
                preserveScroll: true,
                onSuccess: () => setTodoToDelete(null),
            });
        }
    };

    // Feature: High-Focus Priority Sorting (Show Top 2 Uncompleted)
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (
            priorityOrder[a.priority || "medium"] -
            priorityOrder[b.priority || "medium"]
        );
    });

    const displayTodos = sortedTodos.slice(0, 5);
    const activeCount = todos.filter((t) => !t.is_completed).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                        Daily Sprint
                    </h2>
                </div>
                <Link
                    href={route("todos.index")}
                    className="bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-emerald-500 uppercase tracking-widest px-4 py-2 rounded-xl flex items-center transition-all group active:scale-95"
                >
                    Expand{" "}
                    <ChevronRight
                        size={12}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {displayTodos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-6 md:p-5 rounded-[2.2rem] md:rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] ${
                                todo.is_completed
                                    ? "bg-slate-50 dark:bg-slate-900/50 border-slate-50 dark:border-slate-800 opacity-60"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-slate-100/30 dark:hover:shadow-none"
                            }`}
                            onClick={() => handleToggle(todo)}
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className={
                                        todo.is_completed
                                            ? "text-emerald-500"
                                            : "text-slate-200 group-hover:text-emerald-300"
                                    }
                                >
                                    {todo.is_completed ? (
                                        <CheckCircle2
                                            size={24}
                                            strokeWidth={3}
                                        />
                                    ) : (
                                        <Circle size={24} strokeWidth={2.5} />
                                    )}
                                </div>

                                <div>
                                    <p
                                        className={`font-black tracking-tight leading-tight text-base ${todo.is_completed ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-200"}`}
                                    >
                                        {todo.title}
                                    </p>
                                    <div className="flex items-center mt-1 space-x-3">
                                        {!todo.is_completed && (
                                            <div
                                                className={`flex items-center text-[9px] font-black uppercase tracking-widest ${
                                                    todo.priority === "high"
                                                        ? "text-rose-500"
                                                        : todo.priority ===
                                                            "medium"
                                                          ? "text-amber-500"
                                                          : "text-slate-400"
                                                }`}
                                            >
                                                {todo.priority === "high" && (
                                                    <Zap
                                                        size={10}
                                                        className="mr-1 fill-current"
                                                    />
                                                )}
                                                {todo.priority} Priority
                                            </div>
                                        )}
                                        {todo.estimated_minutes > 0 && (
                                            <div className="flex items-center text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                                <Clock
                                                    size={10}
                                                    className="mr-1"
                                                />
                                                {todo.estimated_minutes}m
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!todo.is_completed && (
                                <div className="flex items-center space-x-2">
                                    {todo.priority === "high" && (
                                        <Star
                                            size={16}
                                            className="text-amber-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    )}
                                    <button
                                        disabled={!!activeTask}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startTimer(todo);
                                        }}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 ${
                                            activeTask
                                                ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                                                : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 opacity-0 group-hover:opacity-100 hover:bg-emerald-500 hover:text-white"
                                        }`}
                                        title={
                                            activeTask
                                                ? "Another timer is running"
                                                : "Focus Mode"
                                        }
                                    >
                                        <Play
                                            size={16}
                                            className="fill-current"
                                        />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(todo);
                                        }}
                                        className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {todos.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem]">
                        <p className="text-slate-300 dark:text-slate-600 font-bold italic text-sm">
                            Sprint completed. Rest well.
                        </p>
                    </div>
                )}

            </div>
            {/* Deletion Confirmation */}
            <ConfirmationModal
                show={!!todoToDelete}
                onClose={() => setTodoToDelete(null)}
                onConfirm={confirmDelete}
                title="Remove from Sprint?"
                message={
                    todoToDelete
                        ? `This will permanently delete "${todoToDelete.title}" from your daily actions.`
                        : ""
                }
                confirmText="Confirm Removal"
            />
        </div>
    );
}

import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    CheckCircle2,
    Circle,
    Clock,
    Trash2,
    Zap,
    Sun,
    Sunset,
    Moon,
    MoreVertical,
    ArrowRight,
    Star,
    Target,
    Timer,
    Play,
} from "lucide-react";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useFocusTimer } from "@/Contexts/FocusTimerContext";

export default function Index({ todos, showingHistory }) {
    const [localTodos, setLocalTodos] = useState(todos?.data || []);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("all"); // all, active, completed
    const [todoToDelete, setTodoToDelete] = useState(null);
    const { startTimer, activeTask } = useFocusTimer();

    const { data, setData, post, processing, reset } = useForm({
        title: "",
        priority: "medium",
        time_slot: "morning",
        estimated_minutes: 30,
    });

    const toggleHistory = () => {
        router.get(
            route("todos.index"),
            {
                history: showingHistory ? undefined : true,
            },
            { preserveScroll: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("todos.store"), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const toggleTodo = (todo) => {
        if (showingHistory) return; // Can't toggle history items
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

    const deleteTodo = (todo) => {
        setTodoToDelete(todo);
    };

    useEffect(() => {
        if (todos?.current_page > 1) {
            setLocalTodos((prev) => {
                const newItems = todos.data.filter(
                    (item) => !prev.some((p) => p.id === item.id),
                );
                return [...prev, ...newItems];
            });
        } else {
            setLocalTodos(todos?.data || []);
        }
    }, [todos]);

    const confirmDelete = () => {
        if (todoToDelete) {
            router.delete(route("todos.destroy", todoToDelete.id), {
                preserveScroll: true,
                onSuccess: () => setTodoToDelete(null),
            });
        }
    };

    const loadMore = () => {
        if (!todos?.next_page_url) return;
        router.visit(todos.next_page_url, {
            only: ["todos"],
            preserveState: true,
            preserveScroll: true,
        });
    };

    const ongoingTasks = localTodos.filter((t) => !t.is_completed);
    const completedTasks = localTodos.filter((t) => t.is_completed);
    const filteredTodos =
        filter === "all"
            ? localTodos
            : filter === "active"
              ? ongoingTasks
              : completedTasks;

    // Feature: Focus Hero (First high priority active task)
    const focusTask =
        ongoingTasks.find((t) => t.priority === "high") || ongoingTasks[0];

    const slots = [
        {
            id: "morning",
            icon: <Sun size={18} />,
            label: "Morning Sprint",
            color: "text-amber-500",
        },
        {
            id: "afternoon",
            icon: <Sunset size={18} />,
            label: "Deep Work",
            color: "text-orange-500",
        },
        {
            id: "evening",
            icon: <Moon size={18} />,
            label: "Wind Down",
            color: "text-indigo-500",
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={showingHistory ? "Mastery History" : "Daily Tasks"} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
                                Pillar One
                            </span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-6">
                            {showingHistory ? (
                                <>
                                    Mastery{" "}
                                    <span className="text-emerald-500">
                                        History.
                                    </span>
                                </>
                            ) : (
                                <>
                                    Daily{" "}
                                    <span className="text-emerald-500">
                                        Sprint.
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="text-slate-400 font-bold text-lg">
                            {showingHistory
                                ? "Your lifetime of wins, preserved."
                                : "Turning intentions into action."}
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0 flex items-center space-x-4">
                        <button
                            onClick={toggleHistory}
                            className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 flex items-center space-x-2 ${
                                showingHistory
                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100"
                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                            }`}
                        >
                            <Clock size={14} />
                            <span>
                                {showingHistory
                                    ? "View Sprint"
                                    : "View History"}
                            </span>
                        </button>

                        {!showingHistory && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-20 h-20 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-500 transition-all active:scale-90 shadow-2xl shadow-slate-200"
                            >
                                <Plus size={36} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Focus & Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Focus Hero */}
                        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                                        Active Focus
                                    </span>
                                    <Zap
                                        size={20}
                                        className="text-emerald-400 animate-pulse"
                                    />
                                </div>

                                {focusTask ? (
                                    <>
                                        <h2 className="text-3xl font-black tracking-tight leading-tight mb-6">
                                            {focusTask.title}
                                        </h2>
                                        <div className="flex items-center space-x-6 mb-8">
                                            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                                                <Timer size={14} />
                                                <span>
                                                    {focusTask.estimated_minutes ||
                                                        30}
                                                    m
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                                                <Star
                                                    size={14}
                                                    className="text-amber-400"
                                                />
                                                <span className="capitalize">
                                                    {focusTask.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3">
                                            <button
                                                onClick={() =>
                                                    toggleTodo(focusTask)
                                                }
                                                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-black/20"
                                            >
                                                Complete Now
                                            </button>
                                            <button
                                                disabled={!!activeTask}
                                                onClick={() =>
                                                    startTimer(focusTask)
                                                }
                                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                                                    activeTask
                                                        ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                                                        : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20"
                                                }`}
                                            >
                                                <Play
                                                    size={14}
                                                    className="fill-current"
                                                />
                                                <span>
                                                    {activeTask
                                                        ? "Timer Running"
                                                        : "Start Focus Timer"}
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-10 text-center">
                                        <p className="text-slate-500 font-bold italic">
                                            No active focus. Add a task to
                                            start.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Energy Progress */}
                        <div className="bg-white rounded-[3rem] p-8 border-2 border-slate-50 shadow-xl shadow-slate-100/50">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                Daily Momentum
                            </h3>
                            <div className="relative flex items-center justify-center h-48">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="70"
                                        className="stroke-slate-50 fill-none"
                                        strokeWidth="20"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="70"
                                        className="stroke-emerald-500 fill-none"
                                        strokeWidth="20"
                                        strokeLinecap="round"
                                        initial={{
                                            strokeDasharray: "440",
                                            strokeDashoffset: "440",
                                        }}
                                        animate={{
                                            strokeDashoffset:
                                                440 -
                                                440 *
                                                    (completedTasks.length /
                                                        (localTodos.length ||
                                                            1)),
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "easeOut",
                                        }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                        {Math.round(
                                            (completedTasks.length /
                                                (localTodos.length || 1)) *
                                                100,
                                        )}
                                        %
                                    </span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Mastered
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Timeline/List */}
                    <div className="lg:col-span-8 flex flex-col">
                        {/* Filters */}
                        <div className="flex items-center space-x-2 mb-8 bg-slate-50 p-2 rounded-[2rem] self-start">
                            {["all", "active", "completed"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                        filter === f
                                            ? "bg-white text-slate-900 shadow-md"
                                            : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Grouped Tasks */}
                        <div className="space-y-12">
                            {slots.map((slot) => {
                                const slotTasks = filteredTodos.filter(
                                    (t) =>
                                        t.time_slot === slot.id ||
                                        (!t.time_slot && slot.id === "morning"),
                                );
                                if (slotTasks.length === 0 && filter !== "all")
                                    return null;

                                return (
                                    <div
                                        key={slot.id}
                                        className="relative pl-12"
                                    >
                                        {/* Timeline line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-50 rounded-full"></div>

                                        <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center shadow-sm z-10">
                                            <div className={slot.color}>
                                                {slot.icon}
                                            </div>
                                        </div>

                                        <div className="mb-6 pt-2">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                                                {slot.label}
                                            </h4>
                                        </div>

                                        <div className="space-y-4">
                                            <AnimatePresence mode="popLayout">
                                                {slotTasks.map((todo) => (
                                                    <motion.div
                                                        key={todo.id}
                                                        layout
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            x: 20,
                                                        }}
                                                        className={`group p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${
                                                            todo.is_completed
                                                                ? "bg-slate-50 border-slate-50 opacity-60"
                                                                : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-50/50"
                                                        }`}
                                                        onClick={() =>
                                                            toggleTodo(todo)
                                                        }
                                                    >
                                                        <div className="flex items-center space-x-6">
                                                            <div
                                                                className={
                                                                    todo.is_completed
                                                                        ? "text-emerald-500"
                                                                        : "text-slate-200"
                                                                }
                                                            >
                                                                {todo.is_completed ? (
                                                                    <CheckCircle2
                                                                        size={
                                                                            28
                                                                        }
                                                                        strokeWidth={
                                                                            3
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Circle
                                                                        size={
                                                                            28
                                                                        }
                                                                        strokeWidth={
                                                                            2.5
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4
                                                                    className={`text-xl font-black tracking-tight ${todo.is_completed ? "line-through text-slate-400" : "text-slate-800"}`}
                                                                >
                                                                    {todo.title}
                                                                </h4>
                                                                <div className="flex items-center space-x-4 mt-1">
                                                                    <div
                                                                        className={`text-[10px] font-black uppercase tracking-widest ${
                                                                            todo.priority ===
                                                                            "high"
                                                                                ? "text-rose-500"
                                                                                : todo.priority ===
                                                                                    "medium"
                                                                                  ? "text-amber-500"
                                                                                  : "text-slate-400"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            todo.priority
                                                                        }{" "}
                                                                        Priority
                                                                    </div>
                                                                    {todo.estimated_minutes > 0 && (
                                                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center">
                                                                            <Clock
                                                                                size={
                                                                                    10
                                                                                }
                                                                                className="mr-1"
                                                                            />
                                                                            {
                                                                                todo.estimated_minutes
                                                                            }
                                                                            m
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {!todo.is_completed && (
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    disabled={
                                                                        !!activeTask
                                                                    }
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        startTimer(
                                                                            todo,
                                                                        );
                                                                    }}
                                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                                        activeTask
                                                                            ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                                                            : "opacity-0 group-hover:opacity-100 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                                                    }`}
                                                                    title={
                                                                        activeTask
                                                                            ? "Another timer is running"
                                                                            : "Focus Mode"
                                                                    }
                                                                >
                                                                    <Play
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="fill-current"
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        deleteTodo(
                                                                            todo,
                                                                        );
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {!!todo.is_completed && (
                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    deleteTodo(
                                                                        todo,
                                                                    );
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white"
                                                            >
                                                                <Trash2
                                                                    size={18}
                                                                />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {slotTasks.length === 0 && (
                                                <div className="py-8 border-2 border-dashed border-slate-50 rounded-[2.5rem] flex items-center justify-center">
                                                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
                                                        No tasks scheduled
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {todos?.next_page_url && (
                                <button
                                    onClick={loadMore}
                                    className="w-full py-6 flex items-center justify-center space-x-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95"
                                >
                                    <ArrowRight size={16} />
                                    <span>Load More Sprint Actions</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-lg bg-white rounded-[3.5rem] p-10 border-4 border-white shadow-2xl"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                Next Action
                                <span className="text-emerald-500">.</span>
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                type="button"
                                className="w-10 h-10 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all group shadow-sm shrink-0"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                >
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                    What's the move?
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="e.g., Architect the system"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold text-lg focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                        Priority
                                    </label>
                                    <div className="flex space-x-2">
                                        {["low", "medium", "high"].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() =>
                                                    setData("priority", p)
                                                }
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                                    data.priority === p
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                                                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                        Energy Slot
                                    </label>
                                    <div className="flex space-x-2">
                                        {[
                                            "morning",
                                            "afternoon",
                                            "evening",
                                        ].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() =>
                                                    setData("time_slot", s)
                                                }
                                                className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${
                                                    data.time_slot === s
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                                                        : "bg-slate-50 text-slate-300 hover:text-slate-500"
                                                }`}
                                            >
                                                {s === "morning" ? (
                                                    <Sun size={18} />
                                                ) : s === "afternoon" ? (
                                                    <Sunset size={18} />
                                                ) : (
                                                    <Moon size={18} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                    Estim. Minutes
                                </label>
                                <input
                                    type="number"
                                    value={data.estimated_minutes}
                                    onChange={(e) =>
                                        setData(
                                            "estimated_minutes",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl shadow-slate-200 mt-4 active:scale-95"
                            >
                                Launch Action
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Deletion Confirmation */}
            <ConfirmationModal
                show={!!todoToDelete}
                onClose={() => setTodoToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Action?"
                message={
                    todoToDelete
                        ? `Are you sure you want to delete "${todoToDelete.title}"? This cannot be undone.`
                        : ""
                }
                confirmText="Delete Forever"
            />
        </AuthenticatedLayout>
    );
}

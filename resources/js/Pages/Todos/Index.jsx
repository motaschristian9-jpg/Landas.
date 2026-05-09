import React, { useState, useEffect } from "react";
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
    const [dateToDelete, setDateToDelete] = useState(null);
    const [expandedDates, setExpandedDates] = useState({});
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
        } else if (dateToDelete) {
            router.delete(route("todos.destroyByDate"), {
                data: { date: dateToDelete },
                preserveScroll: true,
                onSuccess: () => setDateToDelete(null),
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

    // History Grouping Logic
    const groupedByDate = localTodos.reduce((groups, todo) => {
        const dateStr = new Date(todo.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        if (!groups[dateStr]) {
            groups[dateStr] = [];
        }
        groups[dateStr].push(todo);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort(
        (a, b) => new Date(b) - new Date(a),
    );

    const toggleDateExpansion = (date) => {
        setExpandedDates((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    return (
        <AuthenticatedLayout>
            <>
                <Head title={showingHistory ? "Mastery History" : "Daily Tasks"} />
                <div className="min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-slate-100">
                                Pillar One
                            </span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.8] mb-6">
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
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-lg">
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
                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-none"
                                    : "bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
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
                                className="w-20 h-20 rounded-[2.5rem] bg-slate-900 dark:bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all active:scale-90 shadow-2xl shadow-slate-200 dark:shadow-none"
                            >
                                <Plus size={36} strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Stats & Focus - Hidden in History */}
                    {!showingHistory && (
                        <div className="lg:col-span-4 flex flex-col items-center">
                        {/* Focus Hero */}
                        <div className="bg-slate-900 dark:bg-slate-800/50 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none w-full">
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
                                                        ? "bg-slate-800 dark:bg-slate-900 text-slate-600 cursor-not-allowed"
                                                        : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 dark:shadow-none"
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

                        {/* Momentum Chart */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border-2 border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none mt-8 w-full">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                Daily Momentum
                            </h3>
                            <div className="relative flex items-center justify-center h-48">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="70"
                                        className="stroke-slate-50 dark:stroke-slate-800 fill-none"
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
                                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
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
                )}

                    {/* Right Side: Timeline/List */}
                    <div
                        className={`${showingHistory ? "lg:col-span-12" : "lg:col-span-8"} flex flex-col`}
                    >
                        {/* Filters - Hidden in History */}
                        {!showingHistory && (
                            <div className="flex items-center space-x-2 mb-8 bg-slate-50 dark:bg-slate-800 p-2 rounded-[2rem] self-start border-2 border-transparent dark:border-slate-800 shadow-sm dark:shadow-none">
                                {["all", "active", "completed"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                            filter === f
                                                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md dark:shadow-none"
                                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Grouped Tasks / History Table */}
                        <div className="space-y-12">
                            {showingHistory ? (
                                <div className="space-y-4">
                                    <div className="overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                                                        Log
                                                    </th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        Mastery Date
                                                    </th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                                                        Task Count
                                                    </th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                                                        Success Rate
                                                    </th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                {sortedDates.map((date) => {
                                                    const tasks =
                                                        groupedByDate[date];
                                                    const completedCount =
                                                        tasks.filter(
                                                            (t) =>
                                                                t.is_completed,
                                                        ).length;
                                                    const rate = Math.round(
                                                        (completedCount /
                                                            tasks.length) *
                                                            100,
                                                    );
                                                    const isExpanded =
                                                        expandedDates[date];

                                                    return (
                                                        <React.Fragment
                                                            key={date}
                                                        >
                                                            <tr
                                                                className={`group hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer ${isExpanded ? "bg-slate-50/50 dark:bg-slate-800/50" : ""}`}
                                                                onClick={() =>
                                                                    toggleDateExpansion(
                                                                        date,
                                                                    )
                                                                }
                                                            >
                                                                <td className="px-8 py-6">
                                                                    <div
                                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${rate === 100 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                                                                    >
                                                                        {rate ===
                                                                        100 ? (
                                                                            <CheckCircle2
                                                                                size={
                                                                                    18
                                                                                }
                                                                                strokeWidth={
                                                                                    3
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Target
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <span className="font-black text-slate-900 dark:text-white tracking-tight text-lg">
                                                                        {date}
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <span className="text-xs font-bold text-slate-500">
                                                                        {
                                                                            tasks.length
                                                                        }{" "}
                                                                        tasks
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="flex-1 h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                            <div
                                                                                className={`h-full rounded-full ${rate === 100 ? "bg-emerald-500" : "bg-amber-400"}`}
                                                                                style={{
                                                                                    width: `${rate}%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-[10px] font-black text-slate-400 w-8">
                                                                            {
                                                                                rate
                                                                            }
                                                                            %
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-right">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setDateToDelete(date);
                                                                        }}
                                                                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-all active:scale-95 group/del"
                                                                        title="Clear this day's history"
                                                                    >
                                                                        <Trash2 size={16} className="group-hover/del:animate-bounce" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            {isExpanded && (
                                                                <tr>
                                                                    <td
                                                                        colSpan="5"
                                                                        className="px-8 py-0 bg-slate-50/30 dark:bg-slate-900/30"
                                                                    >
                                                                        <div className="py-8 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                                                                            <table className="w-full text-left border-collapse">
                                                                                <tbody className="space-y-2">
                                                                                    {tasks.map(
                                                                                        (
                                                                                            todo,
                                                                                        ) => (
                                                                                            <tr
                                                                                                key={
                                                                                                    todo.id
                                                                                                }
                                                                                                className="group/item hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer rounded-2xl"
                                                                                                onClick={(
                                                                                                    e,
                                                                                                ) => {
                                                                                                    e.stopPropagation();
                                                                                                    toggleTodo(
                                                                                                        todo,
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <td className="py-3 px-4 w-12">
                                                                                                    {todo.is_completed ? (
                                                                                                        <CheckCircle2
                                                                                                            size={
                                                                                                                16
                                                                                                            }
                                                                                                            className="text-emerald-500"
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <Circle
                                                                                                            size={
                                                                                                                16
                                                                                                            }
                                                                                                            className="text-slate-200"
                                                                                                        />
                                                                                                    )}
                                                                                                </td>
                                                                                                <td className="py-3 px-4">
                                                                                                    <span
                                                                                                        className={`font-bold text-slate-700 ${todo.is_completed ? "line-through text-slate-400" : ""}`}
                                                                                                    >
                                                                                                        {
                                                                                                            todo.title
                                                                                                        }
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td className="py-3 px-4 w-32">
                                                                                                    <span
                                                                                                        className={`text-[9px] font-black uppercase tracking-widest ${todo.priority === "high" ? "text-rose-500" : todo.priority === "medium" ? "text-amber-500" : "text-slate-400"}`}
                                                                                                    >
                                                                                                        {
                                                                                                            todo.priority
                                                                                                        }
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td className="py-3 px-4 w-32 text-right">
                                                                                                    <div className="flex items-center justify-end text-slate-300">
                                                                                                        <span className="text-[9px] font-black uppercase tracking-widest">
                                                                                                            {
                                                                                                                todo.time_slot
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ),
                                                                                    )}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                slots.map((slot) => {
                                    const slotTasks = filteredTodos.filter(
                                        (t) =>
                                            t.time_slot === slot.id ||
                                            (!t.time_slot &&
                                                slot.id === "morning"),
                                    );
                                    if (
                                        slotTasks.length === 0 &&
                                        filter !== "all"
                                    )
                                        return null;

                                    return (
                                        <div
                                            key={slot.id}
                                            className="relative pl-12"
                                        >
                                            {/* Timeline line */}
                                            <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-50 dark:bg-slate-800 rounded-full"></div>

                                            <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center shadow-sm z-10">
                                                <div className={slot.color}>
                                                    {slot.icon}
                                                </div>
                                            </div>

                                            <div className="mb-6 pt-2">
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
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
                                                                    ? "bg-slate-50 dark:bg-slate-800/50 border-slate-50 dark:border-slate-800 opacity-60"
                                                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-50/50 dark:hover:shadow-none"
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
                                                                        className={`text-xl font-black tracking-tight ${todo.is_completed ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-white"}`}
                                                                    >
                                                                        {
                                                                            todo.title
                                                                        }
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
                                                                        {todo.estimated_minutes >
                                                                            0 && (
                                                                            <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest flex items-center">
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
                                                                                ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                                                                : "opacity-0 group-hover:opacity-100 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
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
                                                                        className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white"
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
                                                                    className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white"
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
                                                    <div className="py-8 border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center">
                                                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
                                                            No tasks scheduled
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}

                            {todos?.next_page_url && (
                                <button
                                    onClick={loadMore}
                                    className="w-full py-6 flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-emerald-500 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all active:scale-95"
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
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border-4 border-white dark:border-slate-800 shadow-2xl"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Next Action
                                <span className="text-emerald-500">.</span>
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                type="button"
                                className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all group shadow-sm shrink-0"
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
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-white font-bold text-lg focus:border-emerald-500 outline-none transition-all"
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
                                                        ? "bg-slate-900 dark:bg-emerald-500 text-white border-slate-900 dark:border-emerald-500 shadow-lg shadow-slate-200 dark:shadow-none"
                                                        : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
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
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none"
                                                        : "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400"
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
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-white font-bold outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-slate-900 dark:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 dark:shadow-none mt-4 active:scale-95"
                            >
                                Launch Action
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Deletion Confirmation */}
            <ConfirmationModal
                show={!!todoToDelete || !!dateToDelete}
                onClose={() => {
                    setTodoToDelete(null);
                    setDateToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={dateToDelete ? "Clear History?" : "Delete Action?"}
                message={
                    dateToDelete
                        ? `Are you sure you want to delete all tasks and history for ${dateToDelete}? This action cannot be undone.`
                        : todoToDelete
                          ? `Are you sure you want to delete "${todoToDelete.title}"? This cannot be undone.`
                          : ""
                }
                confirmText={dateToDelete ? "Clear Day" : "Delete Forever"}
            />
                </div>
            </>
        </AuthenticatedLayout>
    );
}

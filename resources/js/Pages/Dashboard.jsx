import { useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Chart from 'chart.js/auto';

export default function Dashboard({ totalGoals, completedGoals, inProgressGoals, upcomingGoals, todayTodos, activityData }) {
    const { auth } = usePage().props;
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const hour = new Date().getHours();
    let greeting = 'Good Day';
    if (hour < 12) greeting = 'Rise & Shine';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    const incompleteCount = todayTodos.filter(t => !t.is_completed).length;
    const totalToday = todayTodos.length;
    const doneToday = todayTodos.filter(t => t.is_completed).length;
    const percentage = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
    const weeklyMomentum = activityData.reduce((acc, curr) => acc + curr.count, 0);

    const { put } = useForm();

    const toggleTodo = (todo) => {
        put(route('todos.update', todo.id), {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: activityData.map(d => d.day),
                    datasets: [{
                        label: 'Activity Points',
                        data: activityData.map(d => d.count),
                        borderColor: '#10b981',
                        borderWidth: 6,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#10b981',
                        pointBorderWidth: 4,
                        pointRadius: 8,
                        pointHoverRadius: 10,
                        tension: 0.4,
                        fill: true,
                        backgroundColor: gradient,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 16,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 14 },
                            cornerRadius: 20,
                            displayColors: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { display: false }
                        },
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { size: 10, weight: 'bold' },
                                color: '#94a3b8'
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [activityData]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="pt-6 pb-12">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between px-4">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center space-x-4 mb-3 opacity-40">
                            <div className="w-12 h-[3px] bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-2">
                            {greeting},<br />
                            <span className="text-emerald-500">{auth.user.name.split(' ')[0]}</span>.
                        </h1>
                        <p className="text-slate-400 font-bold tracking-tight text-lg ml-1">
                            You have <span className="text-slate-900 font-black underline decoration-emerald-500/30 decoration-4">{incompleteCount} tasks</span> to conquer today.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-white/60 backdrop-blur-xl border-2 border-white p-4 rounded-[2rem] shadow-xl shadow-emerald-50/50 flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Weekly Momentum</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tighter">+{weeklyMomentum} Points</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bento Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    
                    {/* Activity Chart */}
                    <div className="md:col-span-4 lg:col-span-4 bg-white/60 backdrop-blur-3xl rounded-[3.5rem] p-10 border-2 border-white shadow-2xl shadow-emerald-50/20 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] opacity-50 transition-transform duration-1000 group-hover:scale-150"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Productivity Pulse<span className="text-emerald-500">.</span></h3>
                                    <p className="text-xs font-bold text-slate-400">Activity trends for the last 7 days</p>
                                </div>
                                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-xl">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live Tracking</span>
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                <canvas ref={chartRef}></canvas>
                            </div>
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 gap-8">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Daily Velocity</p>
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-6xl font-black tracking-tighter">
                                        {percentage}<span className="text-3xl opacity-50">%</span>
                                    </p>
                                    <div className="w-full bg-white/20 h-3 rounded-full mt-4 overflow-hidden">
                                        <div className="bg-white h-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-4 opacity-70 text-center">{doneToday} of {totalToday} tasks completed</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path></svg>
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Conquered Path</p>
                                    <h4 className="text-3xl font-black tracking-tighter">Mastery Level</h4>
                                </div>
                                <div className="flex items-end justify-between mt-8">
                                    <span className="text-6xl font-black tracking-tighter text-emerald-400">{completedGoals}</span>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Goals Completed</p>
                                        <Link href={route('goals.index')} className="text-emerald-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">View Trophy Room →</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Tasks Hero */}
                    <div className="md:col-span-3 lg:col-span-3 bg-white/60 backdrop-blur-md rounded-[3.5rem] p-10 border-2 border-white shadow-xl shadow-slate-100/50 group">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Daily Mission<span className="text-emerald-500">.</span></h3>
                                <p className="text-xs font-bold text-slate-400">High priority focus for {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            </div>
                            <Link href={route('todos.index')} className="w-12 h-12 bg-emerald-50 hover:bg-emerald-500 rounded-2xl flex items-center justify-center text-emerald-500 hover:text-white transition-all duration-300 group/link">
                                <svg className="w-6 h-6 transition-transform group-hover/link:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 4v16m8-8H4"></path></svg>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {todayTodos.length > 0 ? todayTodos.map(todo => (
                                <div key={todo.id} className="group/task flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-50 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
                                    <div className="flex items-center space-x-5">
                                        <button 
                                            onClick={() => toggleTodo(todo)}
                                            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${todo.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 bg-slate-50 text-transparent hover:border-emerald-500 hover:text-emerald-500'}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7"></path></svg>
                                        </button>
                                        <div>
                                            <span className={`text-lg font-black tracking-tight block ${todo.is_completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                                                {todo.title}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${todo.is_completed ? 'text-slate-200' : 'text-slate-400'}`}>
                                                {todo.due_date ? new Date(todo.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Anytime'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover/task:opacity-100 transition-opacity">
                                        <Link href={route('todos.index')} className="p-2 text-slate-300 hover:text-emerald-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                    </div>
                                    <p className="text-slate-400 font-bold tracking-tight">All clear for now.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="md:col-span-3 lg:col-span-3 bg-white/40 backdrop-blur-md rounded-[3.5rem] p-10 border-2 border-white shadow-xl shadow-slate-100/30">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">The Horizon<span className="text-emerald-500">.</span></h3>
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Next 3 Goals</span>
                        </div>

                        <div className="space-y-6">
                            {upcomingGoals.length > 0 ? upcomingGoals.map(goal => (
                                <div key={goal.id} className="relative pl-10 group/goal">
                                    <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-slate-100 group-last/goal:bg-transparent"></div>
                                    <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-emerald-500 rounded-xl flex items-center justify-center z-10 shadow-lg shadow-emerald-50 group-hover:scale-110 transition-transform">
                                        <span className="text-[10px] font-black text-emerald-600">{new Date(goal.target_date).getDate()}</span>
                                    </div>
                                    
                                    <div className="pb-6">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-lg font-black text-slate-700 tracking-tight">{goal.title}</h4>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">
                                                {/* Note: Simplified relative time for now */}
                                                {new Date(goal.target_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goal.category?.name || 'Uncategorized'}</span>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goal.priority?.name || 'Standard'}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center">
                                    <p className="text-slate-300 font-bold italic">No upcoming goals found.</p>
                                </div>
                            )}
                        </div>

                        <Link href={route('goals.index')} className="block w-full text-center py-5 bg-slate-50 hover:bg-emerald-50 rounded-[2rem] text-slate-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] transition-all mt-4 border border-slate-100 border-dashed">
                            Journey Overview
                        </Link>
                    </div>

                    {/* Quick Action Cards */}
                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-[3rem] p-8 border-2 border-emerald-50 flex items-center justify-between hover:border-emerald-500 transition-all duration-500 group shadow-lg shadow-emerald-50/20">
                        <div className="flex flex-col">
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Ready to move?</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tight">Create New Goal</h4>
                        </div>
                        <Link href={route('goals.index')} className="w-14 h-14 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-200 group-hover:scale-110 group-hover:rotate-12 transition-all">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 4v16m8-8H4"></path></svg>
                        </Link>
                    </div>

                    <div className="md:col-span-2 lg:col-span-2 bg-white rounded-[3rem] p-8 border-2 border-slate-50 flex items-center justify-between hover:border-slate-800 transition-all duration-500 group shadow-lg shadow-slate-100/20">
                        <div className="flex flex-col">
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Need a break?</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tight">Profile Settings</h4>
                        </div>
                        <Link href={route('profile.edit')} className="w-14 h-14 bg-slate-100 text-slate-400 rounded-[1.5rem] flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </Link>
                    </div>

                    <div className="md:col-span-2 lg:col-span-2 bg-emerald-50 rounded-[3rem] p-8 border-2 border-transparent flex items-center justify-between group shadow-sm">
                        <div className="flex flex-col">
                            <p className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Application Stat</p>
                            <h4 className="text-2xl font-black text-emerald-900 tracking-tight">Active In-Motion</h4>
                        </div>
                        <div className="text-5xl font-black text-emerald-500 tracking-tighter">
                            {inProgressGoals}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

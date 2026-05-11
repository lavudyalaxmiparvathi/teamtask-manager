import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import { 
    CheckSquare, 
    Clock, 
    AlertCircle, 
    Briefcase,
    TrendingUp,
    ListTodo,
    Plus
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        totalProjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                        <p className="text-slate-400 mt-1">Track your team's progress and upcoming tasks.</p>
                    </div>
                    <a href="/tasks" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20">
                        <Plus size={18} />
                        Add Task
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Total Projects" 
                        value={stats.totalProjects} 
                        icon={Briefcase} 
                        color="primary"
                    />
                    <StatsCard 
                        title="Total Tasks" 
                        value={stats.totalTasks} 
                        icon={ListTodo} 
                        color="purple"
                    />
                    <StatsCard 
                        title="Completed" 
                        value={stats.completedTasks} 
                        icon={CheckSquare} 
                        color="green"
                    />
                    <StatsCard 
                        title="Overdue" 
                        value={stats.overdueTasks} 
                        icon={AlertCircle} 
                        color="red"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Task Distribution</h3>
                            <button className="text-sm text-primary-500 font-medium hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Pending', count: stats.pendingTasks, color: 'bg-amber-500' },
                                { label: 'In Progress', count: stats.inProgressTasks, color: 'bg-primary-500' },
                                { label: 'Completed', count: stats.completedTasks, color: 'bg-emerald-500' }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400 font-medium">{item.label}</span>
                                        <span className="text-white font-bold">{item.count}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${item.color}`} 
                                            style={{ width: `${stats.totalTasks ? (item.count / stats.totalTasks) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Tasks Section */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                        <h3 className="text-lg font-bold text-white">Recent Tasks</h3>
                        <a href="/tasks" className="text-sm text-primary-500 font-medium hover:underline flex items-center gap-1">
                            Manage All Tasks
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Task Name</th>
                                    <th className="px-6 py-3">Project</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Priority</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {/* Sample tasks for UI - usually these would be fetched from API */}
                                <tr className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-200">Design System Update</td>
                                    <td className="px-6 py-4 text-slate-400">Website Redesign</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold">Pending</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-rose-500 font-bold text-[10px]">High</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href="/tasks" className="text-slate-500 hover:text-primary-500 transition-colors">Manage</a>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-200">API Documentation</td>
                                    <td className="px-6 py-4 text-slate-400">Mobile App</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 text-[10px] font-bold">In Progress</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-amber-500 font-bold text-[10px]">Medium</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href="/tasks" className="text-slate-500 hover:text-primary-500 transition-colors">Manage</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

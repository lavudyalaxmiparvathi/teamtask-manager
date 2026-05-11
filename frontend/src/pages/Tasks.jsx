import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import api from '../services/api';
import { Plus, CheckCircle2, Circle, Clock, Filter, Search, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        project: '', 
        assignedTo: '', 
        priority: 'Medium', 
        status: 'Pending',
        dueDate: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            const [tasksRes, projectsRes, teamRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/projects'),
                api.get('/team')
            ]);
            setTasks(tasksRes.data.data);
            setProjects(projectsRes.data.data);
            setTeam(teamRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditMode) {
                await api.put(`/tasks/${currentTaskId}`, formData);
                toast.success('Task updated successfully!');
            } else {
                await api.post('/tasks', formData);
                toast.success('Task created successfully!');
            }
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} task`);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ 
            title: '', description: '', project: '', assignedTo: '', 
            priority: 'Medium', status: 'Pending', dueDate: '' 
        });
        setIsEditMode(false);
        setCurrentTaskId(null);
    };

    const handleEdit = (task) => {
        setFormData({
            title: task.title,
            description: task.description || '',
            project: task.project?._id || '',
            assignedTo: task.assignedTo?._id || '',
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
        });
        setCurrentTaskId(task._id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/tasks/${id}`, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Tasks</h2>
                        <p className="text-slate-400 mt-1">Organize and track your daily work.</p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsModalOpen(true); }} icon={Plus}>
                        Add Task
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 border-b border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {tasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(task._id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                                                        className={task.status === 'Completed' ? 'text-emerald-500' : 'text-slate-500'}
                                                    >
                                                        {task.status === 'Completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                                    </button>
                                                    <div>
                                                        <p className={`font-medium ${task.status === 'Completed' ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-400 bg-slate-900 px-2 py-1 rounded-md">{task.project?.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white">
                                                        {task.assignedTo?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-slate-300">{task.assignedTo?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                                    task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                                                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                                    <Clock size={14} />
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select 
                                                    value={task.status}
                                                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                                    className="bg-slate-900 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(task)} className="p-2 text-slate-500 hover:text-primary-500 transition-colors">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(task._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Task" : "Add New Task"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
                            <input 
                                type="text" required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="Task name..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea 
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none h-20"
                                placeholder="What needs to be done?"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Project</label>
                                <select 
                                    required
                                    value={formData.project}
                                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Assign To</label>
                                <select 
                                    required
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option value="">Select Member</option>
                                    {team.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                                <select 
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                                <input 
                                    type="date" required
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={submitting}>{isEditMode ? 'Update Task' : 'Create Task'}</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Tasks;

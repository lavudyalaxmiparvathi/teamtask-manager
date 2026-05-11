import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import api from '../services/api';
import { Plus, Briefcase, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/projects', formData);
            toast.success('Project created successfully!');
            setIsModalOpen(false);
            setFormData({ name: '', description: '', status: 'Active' });
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Projects</h2>
                        <p className="text-slate-400 mt-1">Manage your team projects and collaborations.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                            New Project
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-3xl p-20 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">No projects found</h3>
                        <p className="text-slate-400 mt-2 max-w-md mx-auto">Get started by creating your first project and assigning team members to it.</p>
                        {user?.role === 'Admin' && (
                            <Button variant="outline" className="mt-6" onClick={() => setIsModalOpen(true)}>
                                Create First Project
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 transition-colors group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
                                            <Briefcase size={20} />
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                                            project.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' : 
                                            'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mt-4 group-hover:text-primary-400 transition-colors">{project.name}</h3>
                                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {project.team?.slice(0, 3).map((member, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-white" title={member.name}>
                                                    {member.name?.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                            {project.team?.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                                                    +{project.team.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        {user?.role === 'Admin' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleDelete(project._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    title="Create New Project"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="e.g. Website Redesign"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea 
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none h-32"
                                placeholder="What is this project about?"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={submitting}>Create Project</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Projects;

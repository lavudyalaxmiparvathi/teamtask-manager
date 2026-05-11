import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import api from '../services/api';
import { Plus, Users, UserX, Mail, Shield, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Team = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
    const [submitting, setSubmitting] = useState(false);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/team');
            setMembers(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch team members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/team', formData);
            toast.success('Team member added!');
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'Member' });
            fetchTeam();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this member?')) return;
        try {
            await api.delete(`/team/${id}`);
            toast.success('Member removed');
            fetchTeam();
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Team Management</h2>
                        <p className="text-slate-400 mt-1">Manage your team members and their roles.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
                        Add Member
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member) => (
                            <div key={member._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                        {member.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{member.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                            <Mail size={12} />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-between">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        member.role === 'Admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        <Shield size={12} />
                                        {member.role}
                                    </div>
                                    <button onClick={() => handleDelete(member._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                        <UserX size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <input 
                                type="text" required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <input 
                                type="email" required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <input 
                                type="password" required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            >
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={submitting}>Add Member</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Team;

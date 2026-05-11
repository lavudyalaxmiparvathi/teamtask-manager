import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Your Profile</h2>
                    <p className="text-slate-400 mt-1">Manage your account information and preferences.</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-xl">
                    <div className="h-32 bg-gradient-to-r from-primary-600 to-violet-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex items-end gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="pb-2">
                                <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
                                <p className="text-slate-400 capitalize">{user?.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Mail size={14} /> Email Address
                                </label>
                                <p className="text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-700">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Shield size={14} /> Permissions
                                </label>
                                <p className="text-white bg-slate-900/50 px-4 py-3 rounded-xl border border-slate-700">{user?.role === 'Admin' ? 'Full Access (Administrator)' : 'Limited Access (Member)'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;

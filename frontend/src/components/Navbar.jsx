import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 px-6 flex items-center justify-between">
            <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-full px-4 py-1.5 w-96">
                <Search size={18} className="text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search projects or tasks..." 
                    className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-200 placeholder:text-slate-500"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-800"></span>
                </button>
                
                <div className="h-8 w-px bg-slate-700 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold border-2 border-slate-700 shadow-inner">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

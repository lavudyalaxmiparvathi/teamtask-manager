import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Briefcase, 
    CheckSquare, 
    Users, 
    User, 
    LogOut,
    PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: Briefcase },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Team', path: '/team', icon: Users, role: 'Admin' },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary-500 p-2 rounded-lg">
                    <CheckSquare className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">TaskMaster</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => {
                    if (item.role && user?.role !== item.role) return null;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                ${isActive 
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'}
                            `}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

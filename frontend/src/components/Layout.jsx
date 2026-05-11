import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

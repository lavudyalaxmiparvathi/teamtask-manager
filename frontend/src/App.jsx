import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    
    if (!user) return <Navigate to="/login" />;

    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
    
    if (!user || user.role !== 'Admin') return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/projects" element={
                        <ProtectedRoute>
                            <Projects />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/tasks" element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/team" element={
                        <AdminRoute>
                            <Team />
                        </AdminRoute>
                    } />
                    
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                </Routes>
                <Toaster position="top-right" />
            </Router>
        </AuthProvider>
    );
}

export default App;

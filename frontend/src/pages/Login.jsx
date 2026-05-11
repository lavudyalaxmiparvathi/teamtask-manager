import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Successfully logged in!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40">
                        <LogIn className="text-white h-6 w-6" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Please enter your details to sign in
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-slate-400">Don't have an account? </span>
                        <Link to="/signup" className="font-bold text-primary-500 hover:text-primary-400">
                            Sign up for free
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

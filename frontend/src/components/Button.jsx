import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    icon: Icon,
    ...props 
}) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-900/20',
        secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
        outline: 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-slate-100',
        ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800',
        danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-900/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={twMerge(
                'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : Icon ? (
                <Icon size={size === 'sm' ? 16 : 18} />
            ) : null}
            {children}
        </button>
    );
};

export default Button;

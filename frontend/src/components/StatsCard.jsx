import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    const colorClasses = {
        primary: 'bg-primary-500/10 text-primary-500',
        green: 'bg-emerald-500/10 text-emerald-500',
        yellow: 'bg-amber-500/10 text-amber-500',
        red: 'bg-rose-500/10 text-rose-500',
        purple: 'bg-violet-500/10 text-violet-500',
    };

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.primary}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {trend === 'up' ? '+' : '-'}{trendValue}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
        </div>
    );
};

export default StatsCard;

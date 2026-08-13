import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CategoryTrendChart = ({ data = [], loading = false, accent = '#4f46e5' }) => {
  if (loading) {
    return (
      <div className="h-56 rounded-xl bg-slate-50 animate-pulse flex items-center justify-center text-sm text-slate-400">
        Loading activity chart…
      </div>
    );
  }

  const chartData = Array.isArray(data) && data.length ? data : [];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="categoryTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.35} />
              <stop offset="95%" stopColor={accent} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
            formatter={(value) => [value, 'New listings']}
          />
          <Area
            type="monotone"
            dataKey="listings"
            stroke={accent}
            strokeWidth={2.5}
            fill="url(#categoryTrendFill)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryTrendChart;

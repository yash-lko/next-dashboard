// src/components/dashboard/UserGrowthChart.tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const DATA = [
  { month: 'Jan', active: 320, inactive: 41 },
  { month: 'Feb', active: 380, inactive: 38 },
  { month: 'Mar', active: 420, inactive: 45 },
  { month: 'Apr', active: 480, inactive: 52 },
  { month: 'May', active: 540, inactive: 49 },
  { month: 'Jun', active: 620, inactive: 61 },
  { month: 'Jul', active: 580, inactive: 55 },
  { month: 'Aug', active: 680, inactive: 63 },
  { month: 'Sep', active: 720, inactive: 70 },
  { month: 'Oct', active: 810, inactive: 74 },
  { month: 'Nov', active: 880, inactive: 78 },
  { month: 'Dec', active: 923, inactive: 82 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-gray-500 capitalize">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function UserGrowthChart() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">User Growth</h3>
        <p className="text-xs text-gray-400 mt-0.5">Active vs inactive users over 12 months</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={DATA} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barSize={14} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" iconSize={8} />
          <Bar dataKey="active" fill="#6366f1" radius={[4, 4, 0, 0]} name="Active" />
          <Bar dataKey="inactive" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Inactive" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// src/components/dashboard/TrafficChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const MOCK_DATA = [
  { name: 'Organic', value: 4200, color: '#6366f1' },
  { name: 'Direct', value: 2800, color: '#8b5cf6' },
  { name: 'Social', value: 1900, color: '#06b6d4' },
  { name: 'Referral', value: 1100, color: '#10b981' },
  { name: 'Email', value: 800, color: '#f59e0b' },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-sm">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
        <span className="font-semibold text-gray-900">{item.name}</span>
      </div>
      <p className="mt-1 text-gray-500">
        {item.value.toLocaleString()} sessions ({((item.value / 10800) * 100).toFixed(1)}%)
      </p>
    </div>
  );
}

export function TrafficChart() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Traffic Sources</h3>
        <p className="text-xs text-gray-400 mt-0.5">This month</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={MOCK_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {MOCK_DATA.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

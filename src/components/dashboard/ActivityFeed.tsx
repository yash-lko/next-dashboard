// src/components/dashboard/ActivityFeed.tsx

import { formatRelativeTime } from '@/lib/utils';
import type { ActivityItem } from '@/types/api';

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'user_created', description: 'New user Priya Patel was added to Engineering', actor: 'Admin', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: '2', type: 'login', description: 'Arjun Sharma signed in from Mumbai, IN', actor: 'Arjun Sharma', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  { id: '3', type: 'user_updated', description: 'Role changed for Rahul Gupta → Editor', actor: 'Admin', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: '4', type: 'settings_changed', description: 'Two-factor authentication enabled', actor: 'Ananya Singh', timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  { id: '5', type: 'export', description: 'User list exported as CSV (47 records)', actor: 'Vikram Nair', timestamp: new Date(Date.now() - 1 * 86400 * 1000).toISOString() },
  { id: '6', type: 'user_created', description: 'Batch import completed: 12 new users', actor: 'Admin', timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString() },
];

const typeConfig: Record<ActivityItem['type'], { bg: string; icon: string }> = {
  user_created: { bg: 'bg-emerald-100 text-emerald-600', icon: '＋' },
  user_updated: { bg: 'bg-blue-100 text-blue-600', icon: '✎' },
  login: { bg: 'bg-indigo-100 text-indigo-600', icon: '→' },
  settings_changed: { bg: 'bg-amber-100 text-amber-600', icon: '⚙' },
  export: { bg: 'bg-purple-100 text-purple-600', icon: '↓' },
};

interface ActivityFeedProps {
  items?: ActivityItem[];
}

export function ActivityFeed({ items = MOCK_ACTIVITY }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 48 hours</p>
        </div>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          View all →
        </button>
      </div>

      <ol className="space-y-4" aria-label="Activity feed">
        {items.map((item, i) => {
          const cfg = typeConfig[item.type];
          return (
            <li key={item.id} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${cfg.bg}`}>
                  {cfg.icon}
                </span>
                {i < items.length - 1 && (
                  <span className="mt-1 flex-1 w-px bg-gray-100" aria-hidden />
                )}
              </div>
              <div className="pb-4 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">{item.description}</p>
                <p className="mt-1 text-xs text-gray-400">
                  <span className="font-medium text-gray-500">{item.actor}</span>
                  {' · '}
                  <time dateTime={item.timestamp}>{formatRelativeTime(item.timestamp)}</time>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

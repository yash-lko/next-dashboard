// src/app/notifications/page.tsx
'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

type NotifType = 'alert' | 'info' | 'success' | 'warning';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  category: 'system' | 'user' | 'security' | 'billing';
}

const MOCK_NOTIFS: Notification[] = [
  { id: '1', type: 'alert', title: 'Unusual login attempt', body: 'A login from a new IP (103.12.45.99) was blocked. Review your security settings.', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), read: false, category: 'security' },
  { id: '2', type: 'success', title: 'Bulk import completed', body: '12 new users were successfully added to your workspace from the CSV import.', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), read: false, category: 'user' },
  { id: '3', type: 'info', title: 'System maintenance scheduled', body: 'Planned maintenance on May 5, 2:00–4:00 AM UTC. Expect brief service interruptions.', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), read: false, category: 'system' },
  { id: '4', type: 'warning', title: 'Storage nearing limit', body: 'You are using 87% of your 10 GB storage quota. Consider upgrading your plan.', timestamp: new Date(Date.now() - 1 * 86400 * 1000).toISOString(), read: false, category: 'billing' },
  { id: '5', type: 'info', title: 'New team member joined', body: 'Vikram Nair accepted the invitation and joined the Design department.', timestamp: new Date(Date.now() - 2 * 86400 * 1000).toISOString(), read: true, category: 'user' },
  { id: '6', type: 'success', title: 'Monthly report ready', body: 'Your April 2026 activity report has been generated and is ready to download.', timestamp: new Date(Date.now() - 3 * 86400 * 1000).toISOString(), read: true, category: 'system' },
];

const typeConfig: Record<NotifType, { color: string; icon: React.ReactNode }> = {
  alert: {
    color: 'text-red-500 bg-red-50',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  info: {
    color: 'text-blue-500 bg-blue-50',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  },
  success: {
    color: 'text-emerald-500 bg-emerald-50',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  },
  warning: {
    color: 'text-amber-500 bg-amber-50',
    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
};

const categoryLabels: Record<Notification['category'], string> = {
  system: 'System', user: 'Users', security: 'Security', billing: 'Billing',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));
  const dismiss = (id: string) => setNotifications((n) => n.filter((x) => x.id !== id));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="max-w-2xl space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize',
                  filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-50">
            {filtered.map((notif) => {
              const cfg = typeConfig[notif.type];
              return (
                <li
                  key={notif.id}
                  className={cn(
                    'flex items-start gap-4 p-4 transition-colors',
                    !notif.read && 'bg-indigo-50/30'
                  )}
                >
                  <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full', cfg.color)}>
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn('text-sm font-semibold', notif.read ? 'text-gray-700' : 'text-gray-900')}>
                          {notif.title}
                        </p>
                        <Badge variant="neutral" className="text-[10px]">
                          {categoryLabels[notif.category]}
                        </Badge>
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" aria-label="Unread" />
                        )}
                      </div>
                      <time className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatRelativeTime(notif.timestamp)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{notif.body}</p>
                    <div className="mt-2 flex items-center gap-3">
                      {!notif.read && (
                        <button
                          onClick={() => markRead(notif.id)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => dismiss(notif.id)}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

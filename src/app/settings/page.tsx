// src/app/settings/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/auth.store';
import { useUiStore } from '@/lib/store/ui.store';
import {
  profileSettingsSchema,
  notificationSettingsSchema,
  type ProfileSettingsInput,
  type NotificationSettingsInput,
} from '@/lib/validations/schemas';

const TIMEZONES = [
  'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney',
];

function SectionCard({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useUiStore((s) => s.addToast);

  const profileForm = useForm<ProfileSettingsInput>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      bio: '',
      timezone: 'Asia/Kolkata',
    },
  });

  const notifForm = useForm<NotificationSettingsInput>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailDigest: true,
      loginAlerts: true,
      productUpdates: false,
      weeklyReport: true,
    },
  });

  async function onProfileSubmit(data: ProfileSettingsInput) {
    await new Promise((r) => setTimeout(r, 800)); // Simulate API
    addToast({ type: 'success', title: 'Profile updated', description: 'Your changes have been saved.' });
  }

  async function onNotifSubmit(data: NotificationSettingsInput) {
    await new Promise((r) => setTimeout(r, 600));
    addToast({ type: 'success', title: 'Notification preferences saved' });
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <SectionCard title="Profile" description="Update your personal information and preferences.">
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4" noValidate>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
              {user?.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <button type="button" className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                Change avatar →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full name"
              required
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name')}
            />
            <Input
              label="Email address"
              type="email"
              required
              error={profileForm.formState.errors.email?.message}
              {...profileForm.register('email')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell your team a bit about yourself…"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              {...profileForm.register('bio')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <select
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...profileForm.register('timezone')}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={profileForm.formState.isSubmitting}>
              Save Profile
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" description="Control what emails and alerts you receive.">
        <form onSubmit={notifForm.handleSubmit(onNotifSubmit)} className="space-y-4" noValidate>
          <div className="space-y-3">
            {([
              ['emailDigest', 'Daily email digest'],
              ['loginAlerts', 'Login alerts from new devices'],
              ['productUpdates', 'Product updates and announcements'],
              ['weeklyReport', 'Weekly activity report'],
            ] as const).map(([key, label]) => (
              <Toggle
                key={key}
                label={label}
                checked={notifForm.watch(key)}
                onChange={(v) => notifForm.setValue(key, v)}
              />
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={notifForm.formState.isSubmitting}>
              Save Preferences
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* Danger zone */}
      <SectionCard title="Danger Zone">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-800">Delete account</p>
              <p className="text-xs text-red-600 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => addToast({ type: 'info', title: 'Contact support to delete your account' })}
            >
              Delete
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

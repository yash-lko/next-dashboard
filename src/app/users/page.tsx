// src/app/users/page.tsx
'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { UserFormModal } from '@/components/users/UserFormModal';
import { Badge, statusToBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUsers, useDeleteUser } from '@/lib/hooks/useUsers';
import { formatDate } from '@/lib/utils';
import { useUiStore } from '@/lib/store/ui.store';
import type { User, UserFilters } from '@/types/user';

// URL-driven state for shareability + back button support
function useUserFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: Partial<UserFilters> = {
    search: searchParams.get('search') ?? '',
    role: (searchParams.get('role') as UserFilters['role']) ?? 'all',
    status: (searchParams.get('status') as UserFilters['status']) ?? 'all',
    page: Number(searchParams.get('page') ?? 1),
    pageSize: 10,
    sortBy: (searchParams.get('sortBy') as keyof User) ?? 'name',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'asc',
  };

  const setFilter = useCallback(
    (updates: Partial<UserFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === '' || v === 'all') params.delete(k);
        else params.set(k, String(v));
      });
      // Reset page when filters change (not when page itself changes)
      if (!('page' in updates)) params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return { filters, setFilter };
}

export default function UsersPage() {
  const { filters, setFilter } = useUserFilters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading } = useUsers(filters);
  const deleteUser = useDeleteUser();
  const addToast = useUiStore((s) => s.addToast);

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl ?? `https://api.dicebear.com/8.x/notionists/svg?seed=${user.id}`}
            alt=""
            className="h-8 w-8 rounded-full bg-gray-100"
            loading="lazy"
          />
          <div>
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user) => (
        <Badge variant={statusToBadge(user.role)}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (user) => (
        <Badge variant={statusToBadge(user.status)} dot>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      ),
    },
    { key: 'department', header: 'Department', sortable: true },
    {
      key: 'joinedAt',
      header: 'Joined',
      sortable: true,
      render: (user) => (
        <time dateTime={user.joinedAt} className="text-gray-500 text-sm">
          {formatDate(user.joinedAt)}
        </time>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '80px',
      render: (user) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={`Edit ${user.name}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${user.name}?`)) {
                deleteUser.mutate(user.id);
              }
            }}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label={`Delete ${user.name}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="w-64">
            <Input
              placeholder="Search users…"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              leftAdornment={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              }
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => setFilter({ role: e.target.value as UserFilters['role'] })}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by role"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilter({ status: e.target.value as UserFilters['status'] })}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {selectedIds.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm(`Delete ${selectedIds.length} users?`)) {
                  selectedIds.forEach((id) => deleteUser.mutate(id));
                  setSelectedIds([]);
                }
              }}
            >
              Delete {selectedIds.length} selected
            </Button>
          )}
        </div>

        <Button
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Invite User
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        selectable
        onSelectionChange={setSelectedIds}
        onSort={(key, order) => setFilter({ sortBy: key as keyof User, sortOrder: order })}
        emptyState={
          <div className="text-center">
            <p className="font-medium text-gray-600">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        }
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={data.pageSize}
          onPageChange={(p) => setFilter({ page: p })}
        />
      )}

      {/* User form modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        editingUser={editingUser}
      />
    </div>
  );
}

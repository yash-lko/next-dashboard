// src/lib/hooks/useUsers.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { useUiStore } from '@/lib/store/ui.store';
import type { UserFilters, CreateUserDto, UpdateUserDto } from '@/types/user';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Partial<UserFilters>) => [...userKeys.lists(), filters] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

export function useUsers(filters: Partial<UserFilters>) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => usersApi.list(filters),
    placeholderData: keepPreviousData, // No flicker on page change
    staleTime: 30_000, // 30s — user lists don't change that fast
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      addToast({ type: 'success', title: 'User created successfully' });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', title: 'Failed to create user', description: err.message });
    },
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (dto: UpdateUserDto) => usersApi.update(id, dto),
    onSuccess: (updated) => {
      // Update both list cache and detail cache optimistically
      qc.setQueryData(userKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      addToast({ type: 'success', title: 'User updated' });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', title: 'Update failed', description: err.message });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      addToast({ type: 'success', title: 'User deleted' });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', title: 'Delete failed', description: err.message });
    },
  });
}

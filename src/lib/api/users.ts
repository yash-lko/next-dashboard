// src/lib/api/users.ts

import { apiClient } from './client';
import type { User, CreateUserDto, UpdateUserDto, UserFilters, PaginatedResponse } from '@/types/user';

export const usersApi = {
  list: (filters: Partial<UserFilters>) =>
    apiClient.get<PaginatedResponse<User>>('/users', {
      search: filters.search,
      role: filters.role !== 'all' ? filters.role : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      page: filters.page,
      pageSize: filters.pageSize,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),

  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),

  create: (dto: CreateUserDto) =>
    apiClient.post<User>('/users', dto),

  update: (id: string, dto: UpdateUserDto) =>
    apiClient.patch<User>(`/users/${id}`, dto),

  delete: (id: string) =>
    apiClient.delete<void>(`/users/${id}`),

  bulkDelete: (ids: string[]) =>
    apiClient.post<void>('/users/bulk-delete', { ids }),
};

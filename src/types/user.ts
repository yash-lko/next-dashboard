// src/types/user.ts

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  department: string;
  joinedAt: string; // ISO date string
  lastActiveAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  status?: UserStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  page: number;
  pageSize: number;
  sortBy: keyof User;
  sortOrder: 'asc' | 'desc';
}

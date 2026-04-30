'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateUser, useUpdateUser } from '@/lib/hooks/useUsers';
import type { User } from '@/types/user';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['admin', 'editor', 'viewer']),
  department: z.string().min(1, 'Department is required'),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Design',
  'Product',
  'Operations',
  'Finance',
  'HR',
];

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: User | null;
}

export function UserFormModal({ isOpen, onClose, editingUser }: UserFormModalProps) {
  const isEditing = !!editingUser;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser(editingUser?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      department: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        editingUser
          ? {
              name: editingUser.name,
              email: editingUser.email,
              role: editingUser.role,
              department: editingUser.department,
            }
          : { name: '', email: '', role: 'viewer', department: '' }
      );
    }
  }, [isOpen, editingUser, reset]);

  async function onSubmit(data: CreateUserInput) {
    if (isEditing) {
      await updateUser.mutateAsync(data);
    } else {
      await createUser.mutateAsync(data);
    }
    onClose();
  }

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit User' : 'Invite New User'}
      description={
        isEditing
          ? 'Update this user\'s details.'
          : 'Add a new member to your workspace.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="user-form" isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Invite User'}
          </Button>
        </>
      }
    >
      <form
        id="user-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <Input
          label="Full name"
          placeholder="yash"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="yash@acme.io"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('role')}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('department')}
            >
              <option value="">Select…</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-red-500">{errors.department.message}</p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-700">
            An invitation email will be sent to the user with setup instructions.
          </div>
        )}
      </form>
    </Modal>
  );
}
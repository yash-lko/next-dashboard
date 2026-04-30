// src/lib/validations/user.schema.ts

import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .email('Enter a valid email address'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    errorMap: () => ({ message: 'Select a valid role' }),
  }),
  department: z
    .string()
    .min(1, 'Department is required'),
});

export const updateUserSchema = createUserSchema
  .partial()
  .extend({
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// src/lib/validations/auth.schema.ts
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// src/lib/validations/settings.schema.ts
export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100),
  email: z.string().email(),
  bio: z.string().max(500, 'Bio too long').optional(),
  timezone: z.string().min(1, 'Select a timezone'),
});

export const notificationSettingsSchema = z.object({
  emailDigest: z.boolean(),
  loginAlerts: z.boolean(),
  productUpdates: z.boolean(),
  weeklyReport: z.boolean(),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;

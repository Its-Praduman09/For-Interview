import { z } from 'zod';

export const userSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MEMBER', 'USER', 'CUSTOMER']).default('USER')
});
export const updateUserSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }).optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MEMBER', 'USER', 'CUSTOMER']).optional()
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>; 
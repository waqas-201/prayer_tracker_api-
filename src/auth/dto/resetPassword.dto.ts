import { createZodDto } from 'nestjs-zod';
import { baseUserSchema } from './baseUserSchema';
import { z } from 'zod';

// Extend the base schema to add the 'token' field
export const resetPasswordSchema = baseUserSchema
  .omit({
    email: true, // Omit email since it's not needed for reset password
  })
  .extend({
    token: z.string().jwt(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Generate DTO class
export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}

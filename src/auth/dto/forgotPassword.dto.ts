import { createZodDto } from 'nestjs-zod';
import { baseUserSchema } from './baseUserSchema';

const forgotPasswordSchema = baseUserSchema.pick({
  email: true,
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}

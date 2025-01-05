import { createZodDto } from 'nestjs-zod';
import { baseUserSchema } from './baseUserSchema';

export const loginUserSchema = baseUserSchema.omit({
  confirmPassword: true,
});

export class LoginUserDto extends createZodDto(loginUserSchema) {}

import { createZodDto } from 'nestjs-zod';
import { baseUserSchema } from './baseUserSchema';

const registerUserSchema = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
  },
);

export class RegisterUserDto extends createZodDto(registerUserSchema) {}

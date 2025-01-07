import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const forgotPasswordVerifyTokenSchema = z.object({
  token: z.string().jwt(),
});

export class ForgetPasswordVerifyDto extends createZodDto(
  forgotPasswordVerifyTokenSchema,
) {}

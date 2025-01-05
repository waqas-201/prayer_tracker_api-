import { z } from 'zod';
import * as xss from 'xss';
const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()#_+\-=])[A-Za-z\d@$!%*?&()#_+\-=]{8,}$/;


export const baseUserSchema = z.object({
  email: z
    .string()
    .email()
    .transform((input) => xss.filterXSS(input)), // Sanitizing input using xss
  password: z
    .string()
    .min(8)
    .regex(
      passwordStrengthRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirmPassword: z.string().min(8),
});

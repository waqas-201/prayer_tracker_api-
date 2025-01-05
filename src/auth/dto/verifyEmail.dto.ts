import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Define an object schema with 'email' as a field
const verifyEmailSchema = z.object({
  token: z.string().jwt(),
});

// Create DTO based on the object schema
export class VerifyEmailDto extends createZodDto(verifyEmailSchema) {}

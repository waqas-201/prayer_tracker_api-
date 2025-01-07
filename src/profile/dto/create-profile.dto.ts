import { Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import DOMPurify from 'dompurify';

import z from 'zod';

const profileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid username')
    .transform((input) => DOMPurify.sanitize(input)),
  gender: z.nativeEnum(Gender), // Enum is already validated; no need for XSS
  givenName: z
    .string()
    .min(3)
    .max(20)
    .optional()
    .transform((input) => DOMPurify.sanitize(input)),
  familyName: z
    .string()
    .min(3)
    .max(20)
    .optional()
    .transform((input) => DOMPurify.sanitize(input)),
  picture: z
    .string()
    .url('Invalid URL') // Validate URL format
    .regex(/^(https):\/\/[^\s$.?#].[^\s]*$/, 'Invalid URL')
    .optional()
    .transform((input) => DOMPurify.sanitize(input)),
  userId: z
    .string()
    .uuid('Invalid UUID') // Enforce UUID format
    .transform((input) => DOMPurify.sanitize(input)),
  longitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
});

export class CreateProfileDto extends createZodDto(profileSchema) {}

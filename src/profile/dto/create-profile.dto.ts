import { Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import * as DOMPurify from 'isomorphic-dompurify'; // Use * as import

import z from 'zod';

const profileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid username')
    .transform((input) => {
      // Ensure input is a string before sanitizing
      return input && typeof input === 'string'
        ? DOMPurify.sanitize(input)
        : input;
    }),
  gender: z.nativeEnum(Gender),
  givenName: z
    .string()
    .min(3)
    .max(20)
    .optional()
    .transform((input) => {
      return input && typeof input === 'string'
        ? DOMPurify.sanitize(input)
        : input;
    }),
  familyName: z
    .string()
    .min(3)
    .max(20)
    .optional()
    .transform((input) => {
      return input && typeof input === 'string'
        ? DOMPurify.sanitize(input)
        : input;
    }),
  picture: z
    .string()
    .url('Invalid URL')
    .regex(/^(https):\/\/[^\s$.?#].[^\s]*$/, 'Invalid URL')
    .optional()
    .transform((input) => {
      return input && typeof input === 'string'
        ? DOMPurify.sanitize(input)
        : input;
    }),
  userId: z
    .string()
    .cuid()
    .transform((input) => {
      return input && typeof input === 'string'
        ? DOMPurify.sanitize(input)
        : input;
    }),
  longitude: z.number(),
  latitude: z.number(),
});

export class CreateProfileDto extends createZodDto(profileSchema) {}

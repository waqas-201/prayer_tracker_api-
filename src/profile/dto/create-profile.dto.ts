import { Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const profileSchema = z.object({
  username: z.string().min(3).max(20),
  gender: z.nativeEnum(Gender),
  givenName: z.string().min(3).max(20).optional(),
  familyName: z.string().min(3).max(20).optional(),
  picture: z.string().optional(),
  userId: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

export class CreateProfileDto extends createZodDto(profileSchema) {}

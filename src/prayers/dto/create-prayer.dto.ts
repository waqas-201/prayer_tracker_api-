import { PrayerType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPrayerSchema = z.object({
  PrayerType: z.nativeEnum(PrayerType),
  profileId: z.string(),
});
export class CreatePrayerDto extends createZodDto(createPrayerSchema) {}

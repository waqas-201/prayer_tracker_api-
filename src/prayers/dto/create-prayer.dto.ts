import { PrayerStatus, PrayerType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPrayerSchema = z.object({
  PrayerType: z.nativeEnum(PrayerType),
  status: z.nativeEnum(PrayerStatus),
  notes: z.string(),
  performedAt: z.coerce.date(),
});
export class CreatePrayerDto extends createZodDto(createPrayerSchema) {}

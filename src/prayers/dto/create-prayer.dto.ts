import { MenPrayerStatus, PrayerType, WomenPrayerStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPrayerSchema = z.object({
  PrayerType: z.nativeEnum(PrayerType),
  menStatus: z.nativeEnum(MenPrayerStatus).optional(), // Optional field for men's specific prayer statuses
  womenStatus: z.nativeEnum(WomenPrayerStatus).optional(), // Optional field for women's specific prayer statuses
  performedAt: z.coerce.date(),
  profileId: z.string(),
});
export class CreatePrayerDto extends createZodDto(createPrayerSchema) {}

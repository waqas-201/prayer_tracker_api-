import { MenPrayerStatus, PrayerName, WomenPrayerStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPrayerSchema = z.object({
  prayerName: z.nativeEnum(PrayerName),
  profileId: z.string(),
  prayerStatus: z.union([
    z.nativeEnum(MenPrayerStatus),
    z.nativeEnum(WomenPrayerStatus),
  ]),
});
export class CreatePrayerDto extends createZodDto(createPrayerSchema) {}

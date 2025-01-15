import { PrayerName } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPrayerSchema = z.object({
  prayerName: z.nativeEnum(PrayerName),
  profileId: z.string(),
});
export class CreatePrayerDto extends createZodDto(createPrayerSchema) {}

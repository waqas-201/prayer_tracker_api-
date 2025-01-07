import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const prayerTimingsSchema = z.object({
  fajr: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid fajr date' }),

  dhuhr: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid dhuhr date',
  }),

  asr: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid asr date' }),

  maghrib: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid maghrib date',
  }),

  isha: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid isha date' }),

  sunrise: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid sunrise date',
  }),

  sunset: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid sunset date',
  }),

  imsak: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid imsak date',
  }),

  midnight: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid midnight date',
  }),

  profileId: z.string(),
});

export class CreatePrayerTimingsDto extends createZodDto(prayerTimingsSchema) {}

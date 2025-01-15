/*
  Warnings:

  - You are about to drop the column `asr` on the `PrayerTimings` table. All the data in the column will be lost.
  - You are about to drop the column `dhuhr` on the `PrayerTimings` table. All the data in the column will be lost.
  - You are about to drop the column `fajr` on the `PrayerTimings` table. All the data in the column will be lost.
  - You are about to drop the column `isha` on the `PrayerTimings` table. All the data in the column will be lost.
  - You are about to drop the column `maghrib` on the `PrayerTimings` table. All the data in the column will be lost.
  - Added the required column `asrEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asrStart` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dhuhrStart` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duharEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fajarEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fajrStart` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ishaEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ishaStart` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maghribEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maghribStart` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MenPrayerStatus" ADD VALUE 'QAZA';

-- AlterEnum
ALTER TYPE "WomenPrayerStatus" ADD VALUE 'QAZA';

-- AlterTable
ALTER TABLE "PrayerTimings" DROP COLUMN "asr",
DROP COLUMN "dhuhr",
DROP COLUMN "fajr",
DROP COLUMN "isha",
DROP COLUMN "maghrib",
ADD COLUMN     "asrEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "asrStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dhuhrStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duharEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fajarEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fajrStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ishaEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ishaStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maghribEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maghribStart" TIMESTAMP(3) NOT NULL;

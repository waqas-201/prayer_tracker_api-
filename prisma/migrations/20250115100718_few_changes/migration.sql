/*
  Warnings:

  - You are about to drop the column `duharEnd` on the `PrayerTimings` table. All the data in the column will be lost.
  - You are about to drop the column `fajarEnd` on the `PrayerTimings` table. All the data in the column will be lost.
  - Added the required column `dhuhrEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fajrEnd` to the `PrayerTimings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrayerTimings" DROP COLUMN "duharEnd",
DROP COLUMN "fajarEnd",
ADD COLUMN     "dhuhrEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fajrEnd" TIMESTAMP(3) NOT NULL;

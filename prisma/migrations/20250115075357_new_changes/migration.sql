/*
  Warnings:

  - You are about to drop the column `prayerType` on the `Prayer` table. All the data in the column will be lost.
  - Added the required column `prayerName` to the `Prayer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PrayerName" AS ENUM ('FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA');

-- DropIndex
DROP INDEX "Prayer_prayerType_idx";

-- AlterTable
ALTER TABLE "Prayer" DROP COLUMN "prayerType",
ADD COLUMN     "prayerName" "PrayerName" NOT NULL;

-- DropEnum
DROP TYPE "PrayerType";

-- CreateIndex
CREATE INDEX "Prayer_prayerName_idx" ON "Prayer"("prayerName");

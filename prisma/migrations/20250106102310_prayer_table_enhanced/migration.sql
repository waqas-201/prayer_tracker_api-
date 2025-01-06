/*
  Warnings:

  - You are about to drop the column `status` on the `Prayer` table. All the data in the column will be lost.
  - Added the required column `prayerTime` to the `Prayer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MenPrayerStatus" AS ENUM ('TAKBEERE_E_ULA', 'SALATAL_JAMAAH', 'INDIVIDUAL_PRAYER', 'MISSED');

-- CreateEnum
CREATE TYPE "WomenPrayerStatus" AS ENUM ('PRAYED_AT_TIME', 'PRAYED_LATE', 'PRAYED_TOO_LATE', 'MISSED');

-- DropIndex
DROP INDEX "Prayer_status_idx";

-- AlterTable
ALTER TABLE "Prayer" DROP COLUMN "status",
ADD COLUMN     "menStatus" "MenPrayerStatus",
ADD COLUMN     "notifiedAt" TIMESTAMP(3),
ADD COLUMN     "prayerTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "womenStatus" "WomenPrayerStatus";

-- CreateIndex
CREATE INDEX "Prayer_menStatus_idx" ON "Prayer"("menStatus");

-- CreateIndex
CREATE INDEX "Prayer_womenStatus_idx" ON "Prayer"("womenStatus");

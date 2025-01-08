/*
  Warnings:

  - You are about to drop the column `notes` on the `Prayer` table. All the data in the column will be lost.
  - You are about to drop the column `notifiedAt` on the `Prayer` table. All the data in the column will be lost.
  - You are about to drop the column `prayerTime` on the `Prayer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prayer" DROP COLUMN "notes",
DROP COLUMN "notifiedAt",
DROP COLUMN "prayerTime";

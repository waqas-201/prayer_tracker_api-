/*
  Warnings:

  - Made the column `performedAt` on table `Prayer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `latitude` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prayer" ALTER COLUMN "performedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

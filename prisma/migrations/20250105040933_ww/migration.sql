/*
  Warnings:

  - The values [PARTIALLY_COMPLETED,DELAYED] on the enum `PrayerStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `gender` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "PrayerStatus_new" AS ENUM ('MISSED', 'COMPLETED');
ALTER TABLE "Prayer" ALTER COLUMN "status" TYPE "PrayerStatus_new" USING ("status"::text::"PrayerStatus_new");
ALTER TYPE "PrayerStatus" RENAME TO "PrayerStatus_old";
ALTER TYPE "PrayerStatus_new" RENAME TO "PrayerStatus";
DROP TYPE "PrayerStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Prayer" DROP CONSTRAINT "Prayer_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "Prayer" ALTER COLUMN "profileId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
ADD COLUMN     "gender" "Gender" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Profile_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prayer" ADD CONSTRAINT "Prayer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

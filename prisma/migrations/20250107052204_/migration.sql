/*
  Warnings:

  - You are about to drop the column `canRestePassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "canRestePassword",
ADD COLUMN     "canResetPassword" BOOLEAN NOT NULL DEFAULT false;

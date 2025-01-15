-- CreateEnum
CREATE TYPE "SchoolOfThought" AS ENUM ('SHAFI', 'HANFI');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "schoolOfThought" "SchoolOfThought" NOT NULL DEFAULT 'SHAFI';

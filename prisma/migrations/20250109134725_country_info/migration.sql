/*
  Warnings:

  - The values [HANFI] on the enum `SchoolOfThought` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SchoolOfThought_new" AS ENUM ('SHAFI', 'HANAFI');
ALTER TABLE "Profile" ALTER COLUMN "schoolOfThought" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "schoolOfThought" TYPE "SchoolOfThought_new" USING ("schoolOfThought"::text::"SchoolOfThought_new");
ALTER TYPE "SchoolOfThought" RENAME TO "SchoolOfThought_old";
ALTER TYPE "SchoolOfThought_new" RENAME TO "SchoolOfThought";
DROP TYPE "SchoolOfThought_old";
ALTER TABLE "Profile" ALTER COLUMN "schoolOfThought" SET DEFAULT 'SHAFI';
COMMIT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "country" TEXT;

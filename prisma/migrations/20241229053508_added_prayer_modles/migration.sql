-- CreateEnum
CREATE TYPE "PrayerType" AS ENUM ('FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('MISSED', 'COMPLETED', 'PARTIALLY_COMPLETED', 'DELAYED');

-- CreateTable
CREATE TABLE "Prayer" (
    "id" TEXT NOT NULL,
    "prayerType" "PrayerType" NOT NULL,
    "status" "PrayerStatus" NOT NULL,
    "performedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prayer_prayerType_idx" ON "Prayer"("prayerType");

-- CreateIndex
CREATE INDEX "Prayer_status_idx" ON "Prayer"("status");

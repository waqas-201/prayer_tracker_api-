-- DropEnum
DROP TYPE "PrayerStatus";

-- CreateTable
CREATE TABLE "PrayerTimings" (
    "id" TEXT NOT NULL,
    "fajr" TIMESTAMP(3) NOT NULL,
    "dhuhr" TIMESTAMP(3) NOT NULL,
    "asr" TIMESTAMP(3) NOT NULL,
    "maghrib" TIMESTAMP(3) NOT NULL,
    "isha" TIMESTAMP(3) NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "imsak" TIMESTAMP(3) NOT NULL,
    "midnight" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerTimings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrayerTimings_profileId_key" ON "PrayerTimings"("profileId");

-- AddForeignKey
ALTER TABLE "PrayerTimings" ADD CONSTRAINT "PrayerTimings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

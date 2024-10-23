/*
  Warnings:

  - You are about to drop the `JobSeeker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SentJobViaEmailToJobSeeker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobSeekerToLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SentJobViaEmailToJobSeeker" DROP CONSTRAINT "SentJobViaEmailToJobSeeker_jobId_fkey";

-- DropForeignKey
ALTER TABLE "SentJobViaEmailToJobSeeker" DROP CONSTRAINT "SentJobViaEmailToJobSeeker_jobSeekerId_fkey";

-- DropForeignKey
ALTER TABLE "_JobSeekerToLocation" DROP CONSTRAINT "_JobSeekerToLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobSeekerToLocation" DROP CONSTRAINT "_JobSeekerToLocation_B_fkey";

-- DropTable
DROP TABLE "JobSeeker";

-- DropTable
DROP TABLE "SentJobViaEmailToJobSeeker";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_JobSeekerToLocation";

-- DropEnum
DROP TYPE "WorkStatus";

/*
  Warnings:

  - You are about to drop the `_JobToJobSeeker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_JobToJobSeeker" DROP CONSTRAINT "_JobToJobSeeker_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobToJobSeeker" DROP CONSTRAINT "_JobToJobSeeker_B_fkey";

-- DropTable
DROP TABLE "_JobToJobSeeker";

-- CreateTable
CREATE TABLE "SentJobViaEmailToJobSeeker" (
    "jobId" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SentJobViaEmailToJobSeeker_pkey" PRIMARY KEY ("jobId","jobSeekerId")
);

-- AddForeignKey
ALTER TABLE "SentJobViaEmailToJobSeeker" ADD CONSTRAINT "SentJobViaEmailToJobSeeker_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentJobViaEmailToJobSeeker" ADD CONSTRAINT "SentJobViaEmailToJobSeeker_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

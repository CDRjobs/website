-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('highSchool', 'bachelor', 'master', 'doctorate');

-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('employed', 'unemployed', 'selfEmployedOrFreelance', 'student');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "createdAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "JobSeeker" (
    "id" TEXT NOT NULL,
    "wixId" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "email" TEXT NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL,
    "seniority" "Seniority" NOT NULL,
    "workStatus" "WorkStatus" NOT NULL,
    "sectors" TEXT[],
    "seekingContractTypes" "ContractType"[],
    "seekingRemotes" "Remote"[],
    "seekingDisciplines" "Discipline"[],
    "openToTalk" BOOLEAN NOT NULL,
    "whatTypeOfInsightsYouWant" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeeker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobSeekerToLocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JobSeeker_wixId_key" ON "JobSeeker"("wixId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeeker_email_key" ON "JobSeeker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_JobSeekerToLocation_AB_unique" ON "_JobSeekerToLocation"("A", "B");

-- CreateIndex
CREATE INDEX "_JobSeekerToLocation_B_index" ON "_JobSeekerToLocation"("B");

-- AddForeignKey
ALTER TABLE "_JobSeekerToLocation" ADD CONSTRAINT "_JobSeekerToLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "JobSeeker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobSeekerToLocation" ADD CONSTRAINT "_JobSeekerToLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

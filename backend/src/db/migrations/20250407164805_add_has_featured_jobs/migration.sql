-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "hasFeaturedJobs" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "_ClientToCompany" ADD CONSTRAINT "_ClientToCompany_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ClientToCompany_AB_unique";

-- AlterTable
ALTER TABLE "_JobToLocation" ADD CONSTRAINT "_JobToLocation_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_JobToLocation_AB_unique";

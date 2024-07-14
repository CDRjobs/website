/*
  Warnings:

  - A unique constraint covering the columns `[publishedAt]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Made the column `publishedAt` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "realPublishedAt" TIMESTAMP(3),
ALTER COLUMN "publishedAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_publishedAt_key" ON "Job"("publishedAt");

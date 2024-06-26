/*
  Warnings:

  - A unique constraint covering the columns `[airTableId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `airTableId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_coordinates_city_country_key";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "airTableId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_airTableId_key" ON "Job"("airTableId");

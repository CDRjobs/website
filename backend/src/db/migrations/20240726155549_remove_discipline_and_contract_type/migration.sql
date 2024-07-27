/*
  Warnings:

  - You are about to drop the column `contractType` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `discipline` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "contractType",
DROP COLUMN "discipline";

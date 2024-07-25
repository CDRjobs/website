/*
  Warnings:

  - You are about to drop the column `contractNature` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `contractTime` on the `Job` table. All the data in the column will be lost.
  - Made the column `contractType` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "contractNature",
DROP COLUMN "contractTime",
ALTER COLUMN "contractType" SET NOT NULL;

-- DropEnum
DROP TYPE "ContractNature";

-- DropEnum
DROP TYPE "ContractTime";

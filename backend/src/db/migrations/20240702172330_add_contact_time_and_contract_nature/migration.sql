/*
  Warnings:

  - Added the required column `contractNature` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractTime` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractTime" AS ENUM ('fullTime', 'partTime');

-- CreateEnum
CREATE TYPE "ContractNature" AS ENUM ('employee', 'volunteer', 'contractor', 'internship', 'paidFellowship');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "contractNature" "ContractNature" NOT NULL,
ADD COLUMN     "contractTime" "ContractTime" NOT NULL;

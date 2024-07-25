-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('employee', 'volunteer', 'contractor', 'internship', 'paidFellowship');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "contractType" "ContractType";

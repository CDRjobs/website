/*
  Warnings:

  - The values [algae] on the enum `CdrCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CdrCategory_new" AS ENUM ('biomass', 'ecosystemServices', 'soil', 'mineralization', 'directAirCapture', 'utilization', 'mCdr', 'forest');
ALTER TABLE "Company" ALTER COLUMN "cdrCategory" TYPE "CdrCategory_new" USING ("cdrCategory"::text::"CdrCategory_new");
ALTER TYPE "CdrCategory" RENAME TO "CdrCategory_old";
ALTER TYPE "CdrCategory_new" RENAME TO "CdrCategory";
DROP TYPE "CdrCategory_old";
COMMIT;

/*
  Warnings:

  - You are about to drop the column `currencyCode` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `foundDate` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `publishedDate` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[countryCityKey]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foundAt` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastCheckedAt` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCityKey` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Made the column `country` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('aed', 'afn', 'all', 'amd', 'ang', 'aoa', 'ars', 'aud', 'awg', 'azn', 'bam', 'bbd', 'bdt', 'bgn', 'bhd', 'bif', 'bmd', 'bnd', 'bob', 'bov', 'brl', 'bsd', 'btn', 'bwp', 'byn', 'bzd', 'cad', 'cdf', 'che', 'chf', 'chw', 'clf', 'clp', 'cny', 'cop', 'cou', 'crc', 'cup', 'cve', 'czk', 'djf', 'dkk', 'dop', 'dzd', 'egp', 'ern', 'etb', 'eur', 'fjd', 'fkp', 'gbp', 'gel', 'ghs', 'gip', 'gmd', 'gnf', 'gtq', 'gyd', 'hkd', 'hnl', 'htg', 'huf', 'idr', 'ils', 'inr', 'iqd', 'irr', 'isk', 'jmd', 'jod', 'jpy', 'kes', 'kgs', 'khr', 'kmf', 'kpw', 'krw', 'kwd', 'kyd', 'kzt', 'lak', 'lbp', 'lkr', 'lrd', 'lsl', 'lyd', 'mad', 'mdl', 'mga', 'mkd', 'mmk', 'mnt', 'mop', 'mru', 'mur', 'mvr', 'mwk', 'mxn', 'mxv', 'myr', 'mzn', 'nad', 'ngn', 'nio', 'nok', 'npr', 'nzd', 'omr', 'pab', 'pen', 'pgk', 'php', 'pkr', 'pln', 'pyg', 'qar', 'ron', 'rsd', 'rub', 'rwf', 'sar', 'sbd', 'scr', 'sdg', 'sek', 'sgd', 'shp', 'sle', 'sos', 'srd', 'ssp', 'stn', 'svc', 'syp', 'szl', 'thb', 'tjs', 'tmt', 'tnd', 'top', 'try', 'ttd', 'twd', 'tzs', 'uah', 'ugx', 'usd', 'usn', 'uyi', 'uyu', 'uyw', 'uzs', 'ved', 'ves', 'vnd', 'vuv', 'wst', 'xaf', 'xag', 'xau', 'xba', 'xbb', 'xbc', 'xbd', 'xcd', 'xdr', 'xof', 'xpd', 'xpf', 'xpt', 'xsu', 'xua', 'yer', 'zar', 'zmw', 'zwg', 'zwl');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "currencyCode",
DROP COLUMN "foundDate",
DROP COLUMN "publishedDate",
ADD COLUMN     "currency" "CurrencyCode",
ADD COLUMN     "foundAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastCheckedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "countryCityKey" TEXT NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- DropEnum
DROP TYPE "CurrencyCodes";

-- CreateIndex
CREATE UNIQUE INDEX "Location_countryCityKey_key" ON "Location"("countryCityKey");

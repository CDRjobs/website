-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "Remote" AS ENUM ('yes', 'hybrid', 'no');

-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('entryLevel', 'earlyStage', 'midLevel', 'senior', 'verySenior');

-- CreateEnum
CREATE TYPE "Discipline" AS ENUM ('strategyAndConsulting', 'sustainability', 'operationsAndProjectManagement', 'researchAndDevelopment', 'businessDevelopmentAndSales', 'policy', 'engineering', 'marketingAndCommunications', 'administrativeAndSupport', 'financialAndLegal', 'softwareEngineering', 'humanResourcesAndPeopleManagement', 'maintenanceAndTechnicians');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl');

-- CreateEnum
CREATE TYPE "CdrCategory" AS ENUM ('biomass', 'ecosystemServices', 'soil', 'mineralization', 'directAirCapture', 'utilization', 'mCdr', 'forest');

-- CreateEnum
CREATE TYPE "ContractTime" AS ENUM ('fullTime', 'partTime');

-- CreateEnum
CREATE TYPE "ContractNature" AS ENUM ('employee', 'volunteer', 'contractor', 'internship', 'paidFellowship');

-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('af', 'ax', 'al', 'dz', 'as', 'ad', 'ao', 'ai', 'aq', 'ag', 'ar', 'am', 'aw', 'au', 'at', 'az', 'bs', 'bh', 'bd', 'bb', 'by', 'be', 'bz', 'bj', 'bm', 'bt', 'bo', 'bq', 'ba', 'bw', 'bv', 'br', 'io', 'bn', 'bg', 'bf', 'bi', 'kh', 'cm', 'ca', 'cv', 'ky', 'cf', 'td', 'cl', 'cn', 'cx', 'cc', 'co', 'km', 'cg', 'cd', 'ck', 'cr', 'ci', 'hr', 'cu', 'cw', 'cy', 'cz', 'dk', 'dj', 'dm', 'do', 'ec', 'eg', 'sv', 'gq', 'er', 'ee', 'et', 'fk', 'fo', 'fj', 'fi', 'fr', 'gf', 'pf', 'tf', 'ga', 'gm', 'ge', 'de', 'gh', 'gi', 'gr', 'gl', 'gd', 'gp', 'gu', 'gt', 'gg', 'gn', 'gw', 'gy', 'ht', 'hm', 'va', 'hn', 'hk', 'hu', 'is', 'in', 'id', 'ir', 'iq', 'ie', 'im', 'il', 'it', 'jm', 'jp', 'je', 'jo', 'kz', 'ke', 'ki', 'kp', 'kr', 'kw', 'kg', 'la', 'lv', 'lb', 'ls', 'lr', 'ly', 'li', 'lt', 'lu', 'mo', 'mk', 'mg', 'mw', 'my', 'mv', 'ml', 'mt', 'mh', 'mq', 'mr', 'mu', 'yt', 'mx', 'fm', 'ma', 'md', 'mc', 'mn', 'me', 'ms', 'mz', 'mm', 'na', 'nr', 'np', 'nl', 'nc', 'nz', 'ni', 'ne', 'ng', 'nu', 'nf', 'mp', 'no', 'om', 'pk', 'pw', 'ps', 'pa', 'pg', 'py', 'pe', 'ph', 'pn', 'pl', 'pt', 'pr', 'qa', 're', 'ro', 'ru', 'rw', 'bl', 'sh', 'kn', 'lc', 'mf', 'pm', 'vc', 'ws', 'sm', 'st', 'sa', 'sn', 'rs', 'sc', 'sl', 'sg', 'sx', 'sk', 'si', 'sb', 'so', 'za', 'gs', 'ss', 'es', 'lk', 'sd', 'sr', 'sj', 'sz', 'se', 'ch', 'sy', 'tw', 'tj', 'tz', 'th', 'tl', 'tg', 'tk', 'to', 'tt', 'tn', 'tr', 'tm', 'tc', 'tv', 'ug', 'ua', 'ae', 'gb', 'us', 'um', 'uy', 'uz', 'vu', 've', 'vn', 'vg', 'vi', 'wf', 'eh', 'ye', 'zm', 'zw');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('aed', 'afn', 'all', 'amd', 'ang', 'aoa', 'ars', 'aud', 'awg', 'azn', 'bam', 'bbd', 'bdt', 'bgn', 'bhd', 'bif', 'bmd', 'bnd', 'bob', 'bov', 'brl', 'bsd', 'btn', 'bwp', 'byn', 'bzd', 'cad', 'cdf', 'che', 'chf', 'chw', 'clf', 'clp', 'cny', 'cop', 'cou', 'crc', 'cup', 'cve', 'czk', 'djf', 'dkk', 'dop', 'dzd', 'egp', 'ern', 'etb', 'eur', 'fjd', 'fkp', 'gbp', 'gel', 'ghs', 'gip', 'gmd', 'gnf', 'gtq', 'gyd', 'hkd', 'hnl', 'htg', 'huf', 'idr', 'ils', 'inr', 'iqd', 'irr', 'isk', 'jmd', 'jod', 'jpy', 'kes', 'kgs', 'khr', 'kmf', 'kpw', 'krw', 'kwd', 'kyd', 'kzt', 'lak', 'lbp', 'lkr', 'lrd', 'lsl', 'lyd', 'mad', 'mdl', 'mga', 'mkd', 'mmk', 'mnt', 'mop', 'mru', 'mur', 'mvr', 'mwk', 'mxn', 'mxv', 'myr', 'mzn', 'nad', 'ngn', 'nio', 'nok', 'npr', 'nzd', 'omr', 'pab', 'pen', 'pgk', 'php', 'pkr', 'pln', 'pyg', 'qar', 'ron', 'rsd', 'rub', 'rwf', 'sar', 'sbd', 'scr', 'sdg', 'sek', 'sgd', 'shp', 'sle', 'sos', 'srd', 'ssp', 'stn', 'svc', 'syp', 'szl', 'thb', 'tjs', 'tmt', 'tnd', 'top', 'try', 'ttd', 'twd', 'tzs', 'uah', 'ugx', 'usd', 'usn', 'uyi', 'uyu', 'uyw', 'uzs', 'ved', 'ves', 'vnd', 'vuv', 'wst', 'xaf', 'xag', 'xau', 'xba', 'xbb', 'xbc', 'xbd', 'xcd', 'xdr', 'xof', 'xpd', 'xpf', 'xpt', 'xsu', 'xua', 'yer', 'zar', 'zmw', 'zwg', 'zwl');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "verifiedEmail" BOOLEAN NOT NULL DEFAULT false,
    "forgotPasswordToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "coordinates" geography(Point, 4326),
    "city" TEXT,
    "country" "CountryCode" NOT NULL,
    "countryCityKey" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "airTableId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "discipline" "Discipline" NOT NULL,
    "status" "JobStatus" NOT NULL,
    "description" TEXT NOT NULL,
    "remote" "Remote" NOT NULL,
    "currency" "CurrencyCode",
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "seniority" "Seniority",
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "realPublishedAt" TIMESTAMP(3),
    "foundAt" TIMESTAMP(3) NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "contractNature" "ContractNature" NOT NULL,
    "contractTime" "ContractTime" NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "airTableId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyUrl" TEXT NOT NULL,
    "careerPageUrl" TEXT NOT NULL,
    "hqLocationId" TEXT NOT NULL,
    "companySize" "CompanySize" NOT NULL,
    "cdrCategory" "CdrCategory" NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iFrameKey" TEXT NOT NULL,
    "countries" "CountryCode"[],

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobToLocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClientToCompany" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_key_key" ON "Session"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Location_countryCityKey_key" ON "Location"("countryCityKey");

-- CreateIndex
CREATE UNIQUE INDEX "Job_airTableId_key" ON "Job"("airTableId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_publishedAt_key" ON "Job"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Company_airTableId_key" ON "Company"("airTableId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_iFrameKey_key" ON "Client"("iFrameKey");

-- CreateIndex
CREATE UNIQUE INDEX "_JobToLocation_AB_unique" ON "_JobToLocation"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToLocation_B_index" ON "_JobToLocation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToCompany_AB_unique" ON "_ClientToCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToCompany_B_index" ON "_ClientToCompany"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_hqLocationId_fkey" FOREIGN KEY ("hqLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToLocation" ADD CONSTRAINT "_JobToLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToLocation" ADD CONSTRAINT "_JobToLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToCompany" ADD CONSTRAINT "_ClientToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToCompany" ADD CONSTRAINT "_ClientToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

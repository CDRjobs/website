/*
  Warnings:

  - A unique constraint covering the columns `[iFrameKey]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_iFrameKey_key" ON "Client"("iFrameKey");

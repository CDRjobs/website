-- CreateTable
CREATE TABLE "_JobToJobSeeker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobToJobSeeker_AB_unique" ON "_JobToJobSeeker"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToJobSeeker_B_index" ON "_JobToJobSeeker"("B");

-- AddForeignKey
ALTER TABLE "_JobToJobSeeker" ADD CONSTRAINT "_JobToJobSeeker_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToJobSeeker" ADD CONSTRAINT "_JobToJobSeeker_B_fkey" FOREIGN KEY ("B") REFERENCES "JobSeeker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

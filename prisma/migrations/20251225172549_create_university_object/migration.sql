/*
  Warnings:

  - You are about to drop the `CourseExamWeight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Modalities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseExamWeight" DROP CONSTRAINT "CourseExamWeight_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseExamWeight" DROP CONSTRAINT "CourseExamWeight_examAreaId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "universityId" TEXT;

-- DropTable
DROP TABLE "CourseExamWeight";

-- DropTable
DROP TABLE "ExamArea";

-- DropTable
DROP TABLE "Modalities";

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

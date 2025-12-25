-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutOff" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "CutOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutOffCategory" (
    "id" TEXT NOT NULL,
    "cutOffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CutOffCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExamArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseExamWeight" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "examAreaId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CourseExamWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modalities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseExamWeight_courseId_examAreaId_key" ON "CourseExamWeight"("courseId", "examAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "Modalities_id_key" ON "Modalities"("id");

-- AddForeignKey
ALTER TABLE "CutOff" ADD CONSTRAINT "CutOff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutOffCategory" ADD CONSTRAINT "CutOffCategory_cutOffId_fkey" FOREIGN KEY ("cutOffId") REFERENCES "CutOff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseExamWeight" ADD CONSTRAINT "CourseExamWeight_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseExamWeight" ADD CONSTRAINT "CourseExamWeight_examAreaId_fkey" FOREIGN KEY ("examAreaId") REFERENCES "ExamArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

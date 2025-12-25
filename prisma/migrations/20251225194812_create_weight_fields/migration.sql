/*
  Warnings:

  - Added the required column `human_weight` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_weight` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `math_weight` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nature_weight` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `redacao_weight` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "human_weight" INTEGER NOT NULL,
ADD COLUMN     "language_weight" INTEGER NOT NULL,
ADD COLUMN     "math_weight" INTEGER NOT NULL,
ADD COLUMN     "nature_weight" INTEGER NOT NULL,
ADD COLUMN     "redacao_weight" INTEGER NOT NULL;

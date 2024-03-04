/*
  Warnings:

  - Added the required column `text` to the `Embedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Embedding" ADD COLUMN     "text" TEXT NOT NULL;

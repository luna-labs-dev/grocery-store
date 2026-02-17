/*
  Warnings:

  - You are about to drop the column `wholesaleAmount` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "wholesaleAmount",
ADD COLUMN     "wholesaleMinAmount" INTEGER;

-- AlterTable
ALTER TABLE "shopping_event" ADD COLUMN     "elapsedTime" INTEGER;

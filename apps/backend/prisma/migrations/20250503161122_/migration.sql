/*
  Warnings:

  - You are about to drop the column `firebaseId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_firebaseId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "firebaseId",
ADD COLUMN     "externalId" VARCHAR(320) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_externalId_key" ON "user"("externalId");

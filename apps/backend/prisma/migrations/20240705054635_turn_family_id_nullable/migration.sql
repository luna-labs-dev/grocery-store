-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_familyId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "familyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

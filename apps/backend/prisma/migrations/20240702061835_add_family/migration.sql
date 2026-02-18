/*
  Warnings:

  - Added the required column `familyId` to the `shopping_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopping_event" ADD COLUMN     "familyId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "family" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "ownerId" UUID NOT NULL,
    "description" TEXT,
    "inviteCode" VARCHAR(320),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(320) NOT NULL,

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firebaseId" VARCHAR(320) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "displayName" VARCHAR(320) NOT NULL,
    "familyId" UUID NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "family_name_key" ON "family"("name");

-- CreateIndex
CREATE UNIQUE INDEX "family_ownerId_key" ON "family"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "family_inviteCode_key" ON "family"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_firebaseId_key" ON "user"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "family" ADD CONSTRAINT "family_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_event" ADD CONSTRAINT "shopping_event_familyId_family_id_fk" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

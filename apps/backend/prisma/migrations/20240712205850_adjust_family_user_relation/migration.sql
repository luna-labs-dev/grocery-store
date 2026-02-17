-- RenameForeignKey
ALTER TABLE "family" RENAME CONSTRAINT "family_ownerId_user_id_fk" TO "family_ownerId_fkey";

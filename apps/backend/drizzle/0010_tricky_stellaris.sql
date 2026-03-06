ALTER TABLE "group_member" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "role" SET DEFAULT 'member'::text;--> statement-breakpoint
DROP TYPE "public"."groupRoleEnum";--> statement-breakpoint
CREATE TYPE "public"."groupRoleEnum" AS ENUM('owner', 'moderator', 'member');--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "role" SET DEFAULT 'member'::"public"."groupRoleEnum";--> statement-breakpoint
ALTER TABLE "group_member" ALTER COLUMN "role" SET DATA TYPE "public"."groupRoleEnum" USING LOWER("role")::"public"."groupRoleEnum";--> statement-breakpoint
ALTER TABLE "shopping_event" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shopping_event" ALTER COLUMN "status" SET DEFAULT 'ongoing'::text;--> statement-breakpoint
DROP TYPE "public"."shoppingEventStatusEnum";--> statement-breakpoint
CREATE TYPE "public"."shoppingEventStatusEnum" AS ENUM('ongoing', 'canceled', 'finished');--> statement-breakpoint
ALTER TABLE "shopping_event" ALTER COLUMN "status" SET DEFAULT 'ongoing'::"public"."shoppingEventStatusEnum";--> statement-breakpoint
ALTER TABLE "shopping_event" ALTER COLUMN "status" SET DATA TYPE "public"."shoppingEventStatusEnum" USING LOWER("status")::"public"."shoppingEventStatusEnum";--> statement-breakpoint
DROP INDEX "group_member_pkey";--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_groupId_userId_pk" PRIMARY KEY("groupId","userId");
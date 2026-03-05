CREATE TYPE "public"."groupRoleEnum" AS ENUM('OWNER', 'ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TABLE "group_member" (
	"groupId" uuid NOT NULL,
	"userId" text NOT NULL,
	"role" "groupRoleEnum" DEFAULT 'MEMBER' NOT NULL,
	"joinedAt" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"inviteCode" varchar(320),
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"createdBy" varchar(320) NOT NULL,
	CONSTRAINT "group_name_unique" UNIQUE("name"),
	CONSTRAINT "group_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
ALTER TABLE "shopping_event" ALTER COLUMN "familyId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shopping_event" ADD COLUMN "groupId" uuid;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "group_member_pkey" ON "group_member" USING btree ("groupId","userId");--> statement-breakpoint
ALTER TABLE "shopping_event" ADD CONSTRAINT "shopping_event_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;
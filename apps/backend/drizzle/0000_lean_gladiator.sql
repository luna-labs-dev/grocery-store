DO $$ BEGIN
	CREATE TYPE "public"."shoppingEventStatusEnum" AS ENUM('ONGOING', 'CANCELED', 'FINISHED');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "family" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"ownerId" uuid NOT NULL,
	"description" text,
	"inviteCode" varchar(320),
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"createdBy" varchar(320) NOT NULL,
	CONSTRAINT "family_name_unique" UNIQUE("name"),
	CONSTRAINT "family_ownerId_unique" UNIQUE("ownerId"),
	CONSTRAINT "family_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "market" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(60) NOT NULL,
	"name" varchar(100) NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"createdBy" varchar(320) NOT NULL,
	CONSTRAINT "market_code_unique" UNIQUE("code"),
	CONSTRAINT "market_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shoppingEventId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"amount" real NOT NULL,
	"price" "money" NOT NULL,
	"wholesaleMinAmount" real,
	"wholesalePrice" "money",
	"addedAt" timestamp (6) NOT NULL,
	"addedBy" varchar(320) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shopping_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"familyId" uuid NOT NULL,
	"marketId" uuid NOT NULL,
	"description" text,
	"totalPaid" "money" NOT NULL,
	"wholesaleTotal" "money" NOT NULL,
	"retailTotal" "money" NOT NULL,
	"status" "shoppingEventStatusEnum" DEFAULT 'ONGOING' NOT NULL,
	"elapsedTime" bigint,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"finishedAt" timestamp (6),
	"createdBy" varchar(320) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" varchar(320) NOT NULL,
	"email" varchar(320) NOT NULL,
	"familyId" uuid,
	CONSTRAINT "user_externalId_unique" UNIQUE("externalId"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

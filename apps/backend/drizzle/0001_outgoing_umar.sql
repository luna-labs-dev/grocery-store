ALTER TABLE "market" DROP CONSTRAINT "market_code_unique";--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "id" SET DATA TYPE varchar(320);--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "address" varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "latitude" numeric(10, 8) NOT NULL;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "longitude" numeric(11, 8) NOT NULL;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "lastUpdatedAt" timestamp (6) DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "createdBy";
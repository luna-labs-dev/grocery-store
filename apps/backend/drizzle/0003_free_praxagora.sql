ALTER TABLE "market" RENAME COLUMN "address" TO "formattedAddress";--> statement-breakpoint
ALTER TABLE "market" RENAME COLUMN "location" TO "geographicLocation";--> statement-breakpoint
ALTER TABLE "market" DROP CONSTRAINT "market_name_unique";--> statement-breakpoint
DROP INDEX "market_location_idx";--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "neighborhood" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "locationTypes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "market_location_idx" ON "market" USING gist ("geographicLocation");
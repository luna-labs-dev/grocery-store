ALTER TABLE "market" ADD COLUMN "location" geography(Point, 4326) NOT NULL;--> statement-breakpoint
CREATE INDEX "market_location_idx" ON "market" USING gist ("location");
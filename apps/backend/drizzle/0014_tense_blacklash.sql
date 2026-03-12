CREATE TYPE "public"."externalFetchSourceEnum" AS ENUM('OFF', 'UPCITEMDB');--> statement-breakpoint
CREATE TYPE "public"."externalFetchStatusEnum" AS ENUM('SUCCESS', 'MISS', 'ERROR');--> statement-breakpoint
CREATE TABLE "external_fetch_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barcode" varchar(256) NOT NULL,
	"source" "externalFetchSourceEnum" NOT NULL,
	"status" "externalFetchStatusEnum" NOT NULL,
	"durationMs" bigint,
	"responsePayload" jsonb,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "physical_ean" (
	"barcode" varchar(256) PRIMARY KEY NOT NULL,
	"productIdentityId" uuid NOT NULL,
	"source" varchar(50) DEFAULT 'LOCAL' NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_identity" ADD COLUMN "name" varchar(256);--> statement-breakpoint
ALTER TABLE "product_identity" ADD COLUMN "brand" varchar(256);--> statement-breakpoint
ALTER TABLE "product_identity" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "physical_ean" ADD CONSTRAINT "physical_ean_productIdentityId_product_identity_id_fk" FOREIGN KEY ("productIdentityId") REFERENCES "public"."product_identity"("id") ON DELETE no action ON UPDATE no action;
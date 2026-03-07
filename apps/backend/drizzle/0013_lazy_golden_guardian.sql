CREATE TYPE "public"."outboxEventStatusEnum" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "outbox_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "outboxEventStatusEnum" DEFAULT 'pending' NOT NULL,
	"lastError" text,
	"retryCount" bigint DEFAULT 0 NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"processedAt" timestamp (6)
);

CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp (6),
	"refreshTokenExpiresAt" timestamp (6),
	"scope" text,
	"password" text,
	"createdAt" timestamp (6) NOT NULL,
	"updatedAt" timestamp (6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp (6) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp (6) NOT NULL,
	"updatedAt" timestamp (6) NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp (6) NOT NULL,
	"createdAt" timestamp (6),
	"updatedAt" timestamp (6)
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "externalId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "emailVerified" boolean;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp (6);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updatedAt" timestamp (6);--> statement-breakpoint
UPDATE "user" SET
  "name" = COALESCE("email", 'unknown'),
  "emailVerified" = false,
  "createdAt" = NOW(),
  "updatedAt" = NOW()
WHERE "name" IS NULL OR "emailVerified" IS NULL OR "createdAt" IS NULL OR "updatedAt" IS NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
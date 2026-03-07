CREATE TABLE "canonical_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"brand" varchar(256),
	"description" text,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_identity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonicalProductId" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"value" varchar(256) NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"groupId" uuid NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" jsonb NOT NULL,
	"updatedAt" timestamp (6) DEFAULT now() NOT NULL,
	CONSTRAINT "settings_groupId_key_pk" PRIMARY KEY("groupId","key")
);
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "canonicalProductId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_identity" ADD CONSTRAINT "product_identity_canonicalProductId_canonical_product_id_fk" FOREIGN KEY ("canonicalProductId") REFERENCES "public"."canonical_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_canonicalProductId_canonical_product_id_fk" FOREIGN KEY ("canonicalProductId") REFERENCES "public"."canonical_product"("id") ON DELETE no action ON UPDATE no action;
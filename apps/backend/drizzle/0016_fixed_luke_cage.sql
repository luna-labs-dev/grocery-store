CREATE TABLE "market_product_price" (
	"marketId" varchar(320) NOT NULL,
	"productIdentityId" uuid NOT NULL,
	"price" "money" NOT NULL,
	"lastVerifiedAt" timestamp (6) DEFAULT now() NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "market_product_price_marketId_productIdentityId_pk" PRIMARY KEY("marketId","productIdentityId")
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"marketId" varchar(320) NOT NULL,
	"productIdentityId" uuid NOT NULL,
	"price" "money" NOT NULL,
	"verifiedAt" timestamp (6) DEFAULT now() NOT NULL,
	"consensusId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"marketId" varchar(320) NOT NULL,
	"productIdentityId" uuid NOT NULL,
	"price" "money" NOT NULL,
	"reportedAt" timestamp (6) DEFAULT now() NOT NULL,
	"isOutlier" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "market_product_price" ADD CONSTRAINT "market_product_price_marketId_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_product_price" ADD CONSTRAINT "market_product_price_productIdentityId_product_identity_id_fk" FOREIGN KEY ("productIdentityId") REFERENCES "public"."product_identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_marketId_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_productIdentityId_product_identity_id_fk" FOREIGN KEY ("productIdentityId") REFERENCES "public"."product_identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_report" ADD CONSTRAINT "price_report_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_report" ADD CONSTRAINT "price_report_marketId_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_report" ADD CONSTRAINT "price_report_productIdentityId_product_identity_id_fk" FOREIGN KEY ("productIdentityId") REFERENCES "public"."product_identity"("id") ON DELETE no action ON UPDATE no action;
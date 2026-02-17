-- CreateEnum
CREATE TYPE "shoppingEventStatusEnum" AS ENUM ('ONGOING', 'CANCELED', 'FINISHED');

-- CreateTable
CREATE TABLE "market" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(60) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(320) NOT NULL,

    CONSTRAINT "market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "marketId" UUID NOT NULL,
    "description" TEXT,
    "totalPaid" MONEY NOT NULL,
    "wholesaleTotal" MONEY NOT NULL,
    "retailTotal" MONEY NOT NULL,
    "status" "shoppingEventStatusEnum" NOT NULL DEFAULT 'ONGOING',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(6),
    "createdBy" VARCHAR(320) NOT NULL,

    CONSTRAINT "shopping_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shoppingEventId" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "amount" INTEGER NOT NULL,
    "wholesaleAmount" INTEGER,
    "price" MONEY NOT NULL,
    "wholesalePrice" MONEY,
    "addedAt" TIMESTAMP(6) NOT NULL,
    "addedBy" VARCHAR(320) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "market_code_key" ON "market"("code");

-- CreateIndex
CREATE UNIQUE INDEX "market_name_key" ON "market"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");

-- AddForeignKey
ALTER TABLE "shopping_event" ADD CONSTRAINT "shopping_event_marketId_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_shoppingEventId_shopping_event_id_fk" FOREIGN KEY ("shoppingEventId") REFERENCES "shopping_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

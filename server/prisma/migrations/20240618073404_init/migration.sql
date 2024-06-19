-- CreateTable
CREATE TABLE "Account" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "BillingState" TEXT,
    "Phone" TEXT,
    "Type" TEXT,
    "ShippingState" TEXT,
    "Industry" TEXT,
    "Website" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Amount" DOUBLE PRECISION,
    "CloseDate" TIMESTAMP(3) NOT NULL,
    "StageName" TEXT NOT NULL,
    "IsClosed" BOOLEAN,
    "IsWon" BOOLEAN,
    "AccountId" TEXT,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_Name_key" ON "Account"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_Name_key" ON "Opportunity"("Name");

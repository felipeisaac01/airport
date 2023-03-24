-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "totalValue" INTEGER NOT NULL,
    "flightClassId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "luggageId" TEXT,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Luggage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "code" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "Luggage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_number_key" ON "tickets"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Luggage_code_key" ON "Luggage"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Luggage_ticketId_key" ON "Luggage"("ticketId");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_flightClassId_fkey" FOREIGN KEY ("flightClassId") REFERENCES "flight_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Luggage" ADD CONSTRAINT "Luggage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

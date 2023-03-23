-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('CONFIRMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "FlightClassOptions" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateTable
CREATE TABLE "flights" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "departureAirportId" TEXT NOT NULL,
    "destinationAirportId" TEXT NOT NULL,
    "status" "FlightStatus" NOT NULL DEFAULT 'CONFIRMED',

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_classes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "flightId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "type" "FlightClassOptions" NOT NULL,

    CONSTRAINT "flight_classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flights_code_key" ON "flights"("code");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_departureAirportId_fkey" FOREIGN KEY ("departureAirportId") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_destinationAirportId_fkey" FOREIGN KEY ("destinationAirportId") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_classes" ADD CONSTRAINT "flight_classes_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

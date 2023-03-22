import { prismaClient } from "../prisma";
import { AirportRepository } from "./AirportRepository";
import { AdminRepository } from "./AdminRepository"
import { FlightRepository } from "./FlightRepository";
import { FlightClassRepository } from "./FlightClassRepository";

export const repositories = {
    admin: new AdminRepository(prismaClient),
    airport: new AirportRepository(prismaClient),
    flight: new FlightRepository(prismaClient),
    flightClass: new FlightClassRepository(prismaClient)
}

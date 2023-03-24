import { prismaClient } from "../prisma";
import { AirportRepository } from "./AirportRepository";
import { UserRepository } from "./UserRepository"
import { FlightRepository } from "./FlightRepository";
import { FlightClassRepository } from "./FlightClassRepository";

export const repositories = {
    user: new UserRepository(prismaClient),
    airport: new AirportRepository(prismaClient),
    flight: new FlightRepository(prismaClient),
    flightClass: new FlightClassRepository(prismaClient)
}

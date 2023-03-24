import { prismaClient } from "../prisma";
import { AirportRepository } from "./AirportRepository";
import { UserRepository } from "./UserRepository"
import { FlightRepository } from "./FlightRepository";
import { FlightClassRepository } from "./FlightClassRepository";
import { TicketRepository } from "./TicketRepository";
import { LuggageRepository } from "./LuggageRepository";

export const repositories = {
    airport: new AirportRepository(prismaClient),
    flight: new FlightRepository(prismaClient),
    flightClass: new FlightClassRepository(prismaClient),
    luggage: new LuggageRepository(prismaClient),
    ticket: new TicketRepository(prismaClient),
    user: new UserRepository(prismaClient),
}

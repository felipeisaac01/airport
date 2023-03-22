import { prismaClient } from "../prisma";
import { AirportRepository } from "./AirportRepository";

export const airportRepository = new AirportRepository(prismaClient)
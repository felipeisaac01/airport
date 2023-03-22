import { prismaClient } from "../prisma";
import { AirportRepository } from "./AirportRepository";
import { AdminRepository } from "./AdminRepository"

export const repositories = {
    admin: new AdminRepository(prismaClient),
    airport: new AirportRepository(prismaClient)
}

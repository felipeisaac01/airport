import { PrismaClient } from "@prisma/client";
import { FlightClassType } from "../domain/dtos/controllers/flight";
import { IFlightClassRepository } from "../domain/interfaces/repositories/FlightClassRepository";

export class FlightClassRepository implements IFlightClassRepository  {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.flightClass
    }

    async get(id: string) {
        return this.client.findFirst({
            where: {
                id,
                deletedAt: null
            }
        })
    }

    async getByFlightAndType(flightId: string, type: FlightClassType) {
        return this.client.findFirst({ where: {
            flightId,
            type,
            deletedAt: null
        }})
    }
}
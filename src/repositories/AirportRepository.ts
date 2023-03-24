import { PrismaClient } from "@prisma/client";
import { IAirportRepository } from "../domain/interfaces/repositories/AirportRepository";

export class AirportRepository implements IAirportRepository {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.airport
    }

    async getAll() {
        const airports = this.client.findMany({
            where: {
                deletedAt: null
            },
            include: {
                city: true
            }
        })

        return airports
    }

    async get(id: string) {
        return this.client.findUnique({ where: { id }})
    }
}
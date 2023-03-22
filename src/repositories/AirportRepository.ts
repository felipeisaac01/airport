import { PrismaClient } from "@prisma/client";
import { IAirportRepository } from "../domain/interfaces/repositories/AirportRepository";

export class AirportRepository implements IAirportRepository {
    constructor(private client: PrismaClient) {}

    async getAll() {
        const airports = this.client.airport.findMany({
            where: {
                deletedAt: null
            },
            include: {
                city: true
            }
        })

        return airports
    }
}
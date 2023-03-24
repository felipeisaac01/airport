import { PrismaClient } from "@prisma/client";
import { ITicketRepository } from "../domain/interfaces/repositories/TicketRepository";

export class TicketRepository implements ITicketRepository {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.ticket
    }

    async getCountByClass(flightClassId: string) {
        return this.client.count({
            where: {
                flightClassId 
            }
        })
    }
}
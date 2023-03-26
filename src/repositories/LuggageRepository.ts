import { PrismaClient } from "@prisma/client";
import { transformDocument } from "@prisma/client/runtime";
import { ILuggageRepository } from "../domain/interfaces/repositories/LuggageRepository";

export class LuggageRepository implements ILuggageRepository {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.luggage
    }

    async getByTicketId(ticketId: string) {
        return this.client.findFirst({
            where: {
                ticketId
            },
            select: {
                code: true,
                ticket: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            }
        })
    }
}
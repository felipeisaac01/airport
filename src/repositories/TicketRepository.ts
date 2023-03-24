import { PrismaClient } from "@prisma/client";
import { ICreateTicketItemMethodDto } from "../domain/dtos/repositories/TicketRepository";
import { ITicketRepository } from "../domain/interfaces/repositories/TicketRepository";

export class TicketRepository implements ITicketRepository {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.ticket
    }

    async getCountByClass(flightClassId: string) {
        return this.client.count({
            where: {
                flightClassId,
                deletedAt: null 
            }
        })
    }

    async createTickets(data: ICreateTicketItemMethodDto[]) {
        const prismaPromises = [];

        for (const item of data) {
            prismaPromises.push(this.client.create({ 
                data: {
                    ...item,
                    luggage: item.luggage ? {
                        create: {
                            code: item.luggage
                        }
                    } : undefined
                },
                include: {
                    buyer: true,
                    flightClass: {
                        include: {
                            flight: {
                                include: {
                                    departureAirport: true,
                                    destinationAirport: true
                                }
                            }
                        }
                    },
                    luggage: true
                }
             }))
        }

        return this.prisma.$transaction(prismaPromises)
    }
}
import { PrismaClient } from "@prisma/client";
import { ICreateTicketItemMethodDto, IGetTicketCountByclassesIds } from "../domain/dtos/repositories/TicketRepository";
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
                select: {
                    birthdate: true,
                    code: true,
                    cpf: true,
                    id:true,
                    name:true,
                    luggage: {
                        select: {
                            code:true
                        }
                    },
                    flightClass: {
                        select: {
                            type: true,
                            flight: {
                                select: {
                                    departureTime: true,
                                    code: true,
                                    departureAirport: {
                                        select: {
                                            iataCode: true,
                                        }
                                    },
                                    destinationAirport: {
                                        select: {
                                            iataCode: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
             }))
        }

        return this.prisma.$transaction(prismaPromises)
    }

    async getTicketCountByclassesIds(flightClassesIds: string[])  {
        return this.client.groupBy({
            by: ["flightClassId"],
            where: {
                deletedAt: null,
                flightClassId: { in: flightClassesIds },
            },
            _count: {
                id: true
            }
        })
    }

    async getTicketById(id: string) {
        return this.client.findFirst({
            where: { id, deletedAt: null }
        })
    }

    async getEmissionInfoByTicketId(id: string) {
        return this.client.findFirst({
            where: { id, deletedAt: null },
            select: {
                birthdate: true,
                cpf: true,
                name: true,
                code: true,
                luggage: true,
                flightClass: {
                    select: {
                        type: true,
                        flight: {
                            select: {
                                code: true,
                                departureAirport: {
                                    select: {
                                        iataCode: true
                                    }
                                },
                                destinationAirport: {
                                    select: {
                                        iataCode: true
                                    }
                                },
                                departureTime: true,
                            }
                        }
                    }
                }
            }
        })
    }
}
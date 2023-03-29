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
                deletedAt: null,
                canceled: false 
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
                canceled: false
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
                buyerId: true,
                flightClass: {
                    select: {
                        type: true,
                        flight: {
                            select: {
                                code: true,
                                status: true,
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

    async getTicketsBybuyerId(buyerId: string) {
        return this.client.findMany({
            where: {
                buyerId,
                deletedAt: null
            },
            select: {
                birthdate: true,
                cpf: true,
                code: true,
                canceled: true,
                luggage: {
                    select: {
                        code: true
                    }
                },
                name:true,
                totalValue:true,
                id: true,
                flightClass: {
                    select: {
                        flight: {
                            select: {
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
                                code: true,
                            }
                        }
                    }
                },
            }
        })
    }

    async cancelTicket(id: string) {
        return this.client.update({
            where: { id },
            data: { canceled: true },
            select: {
                code: true,
                canceled: true,
                cpf: true,
                name: true,
                totalValue: true,
                birthdate: true
            }
        })
    }

    async getFlightInfo(ticketId: string) {
        const response = await this.client.findFirst({
            where: { id: ticketId },
            select: {
                flightClass: {
                    select: {
                        flight: {
                            select: {
                                departureTime: true,
                                status: true
                            }
                        }
                    }
                }
            }
        })

        return response?.flightClass.flight
    }

    async getTicketsByFlightId(flightId: string) {
        return this.client.findMany({
            where: {
                canceled: false,
                flightClass: {
                    flightId
                }
            },
            include: {
                flightClass: {
                    select: {
                        type: true
                    }
                }
            }
        })
    }
}
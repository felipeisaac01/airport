import { PrismaClient } from "@prisma/client";
import { IUpdateFlightDto } from "../domain/dtos/controllers/flight";
import {  ICreateFlightMethodDto, ICreateFlightMethodResponseDto, IUpdateFlightMethodDto } from "../domain/dtos/repositories/FlightRepository";
import { IFlightRepository } from "../domain/interfaces/repositories/FlightRepository";

export class FlightRepository implements IFlightRepository {
    private client;
    constructor(private prisma: PrismaClient) {
        this.client = prisma.flight
    }

    async createFlightWithClasses(data: ICreateFlightMethodDto): Promise<ICreateFlightMethodResponseDto> {
        const { classes, code, departureAirportId, departureTime, destinationAirportId } = data
        return this.client.create({ 
            data: {
                code,
                departureTime, 
                departureAirportId,
                destinationAirportId,
                flightClasses: {
                    createMany: {
                        data: classes
                    }
                }
            },
            select: {
                id:true,
                code: true,
                createdAt: true,
                departureTime: true,
                status: true,
                departureAirport: {
                    select: {
                        iataCode: true,
                        name: true,
                        id: true
                    }
                },
                destinationAirport: {
                    select: {
                        iataCode: true,
                        name: true,
                        id: true
                    }
                },
                flightClasses: {
                    select: {
                        value: true,
                        type: true,
                        id: true,
                        quantity: true
                    }
                },
            }
        })
    }

    async get(id: string) {
        return this.client.findUnique({ 
            where: { id },
            select: {
                code: true,
                departureTime: true,
                id: true,
                departureAirport: {
                    select: {
                        id: true,
                        cityId: true,
                        name: true,
                        iataCode: true
                    }
                },
                destinationAirport: {
                    select: {
                        cityId: true,
                        id: true,
                        name: true,
                        iataCode: true
                    }
                },
                flightClasses: {
                    select: {
                        id: true,
                        type: true,
                        value: true,
                        quantity: true
                    }
                }
            }
        })
    }

    async update(id: string, data: IUpdateFlightMethodDto) {
        return this.client.update({
            where: { id },
            data: {
                ...data
            },
            select: {
                code: true,
                departureTime: true,
                id: true,
                departureAirport: {
                    select: {
                        iataCode: true,
                        name: true,
                        id: true
                    }
                },
                destinationAirport: {
                    select: {
                        iataCode: true,
                        name: true,
                        id: true
                    }
                },
            }
        })
    }

    async cancel(id: string) {
        return this.client.update({
            where: { id },
            data: { status: "CANCELED" }
        })
    }

    async checkIfCodeIsInUse(code: string, id: string) {
        return this.client.findFirst({ where: { code, id: { not: id } } })
    }
}
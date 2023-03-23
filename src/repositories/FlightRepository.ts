import { PrismaClient } from "@prisma/client";
import { IUpdateFlightDto } from "../domain/dtos/controllers/flight";
import {  ICreateFlightMethodDto, ICreateFlightMethodResponseDto, IUpdateFlightMethodDto } from "../domain/dtos/repositories/FlightRepository";
import { IFlightRepository } from "../domain/interfaces/repositories/FlightRepository";

export class FlightRepository implements IFlightRepository {
    constructor(private client: PrismaClient) {}

    async createFlightWithClasses(data: ICreateFlightMethodDto): Promise<ICreateFlightMethodResponseDto> {
        const { classes, code, departureAirportId, departureTime, destinationAirportId } = data
        return this.client.flight.create({ 
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
        return this.client.flight.findUnique({ 
            where: { id },
            select: {
                code: true,
                departureTime: true,
                id: true,
                departureAirport: {
                    select: {
                        cityId: true,
                        id: true
                    }
                },
                destinationAirport: {
                    select: {
                        cityId: true,
                        id: true
                    }
                },
            }
        })
    }

    async update(id: string, data: IUpdateFlightMethodDto) {
        return this.client.flight.update({
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
}
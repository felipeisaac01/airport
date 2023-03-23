import { PrismaClient } from "@prisma/client";
import {  ICreateFlightMethodDTO, ICreateFlightMethodResponseDTO } from "../domain/dtos/repositories/FlightRepository";
import { IFlightRepository } from "../domain/interfaces/repositories/FlightRepository";

export class FlightRepository implements IFlightRepository {
    constructor(private client: PrismaClient) {}

    async createFlightWithClasses(data: ICreateFlightMethodDTO): Promise<ICreateFlightMethodResponseDTO> {
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
}
import { PrismaClient } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { FlightClassType } from "../domain/dtos/controllers/flight";
import { IGetFilteredClassesForPurchaseDto } from "../domain/dtos/repositories/FlightClassRepository";
import { IFlightClassRepository } from "../domain/interfaces/repositories/FlightClassRepository";

export class FlightClassRepository implements IFlightClassRepository  {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.flightClass
    }

    async get(id: string) {
        return this.client.findFirst({
            where: {
                id,
                deletedAt: null
            }
        })
    }

    async getByFlightAndType(flightId: string, type: FlightClassType) {
        return this.client.findFirst({ where: {
            flightId,
            type,
            deletedAt: null
        }})
    }

    async getFilteredClassesForPurchase(data: IGetFilteredClassesForPurchaseDto) {
        const { date, departureAirportCode, destinationAirportCode, maxValue, minValue } = data
        return this.client.findMany({
            where: {
                deletedAt: null,
                flight:  {
                    deletedAt: null,
                    status: "CONFIRMED",
                    departureAirport: {
                        iataCode: departureAirportCode
                    },
                    destinationAirport: {
                        iataCode: destinationAirportCode
                    },
                    departureTime: date ? {
                        gte: startOfDay(date),
                        lte: endOfDay(date)
                    } : { gte: new Date() },
                },
                value: {
                    gte: minValue,
                    lte: maxValue
                }
            },
            select: {
                id: true,
                type: true,
                value: true,
                quantity: true,
                flight: {
                    select: {
                        id: true,
                        code: true, 
                        departureTime: true,
                    }
                }
            }
        })
    }
}
import { PrismaClient } from "@prisma/client";
import { IFlightClassesDto } from "../domain/dtos/controllers/FlightClasses";
import { IFlightClassRepository } from "../domain/interfaces/repositories/FlightClassRepository";

export class FlightClassRepository implements IFlightClassRepository  {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.flightClass
    }

    async create(data: IFlightClassesDto) {
        return this.client.create({ data })
    }
}
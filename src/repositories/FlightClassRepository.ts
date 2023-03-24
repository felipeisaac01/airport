import { PrismaClient } from "@prisma/client";
import { IFlightClassRepository } from "../domain/interfaces/repositories/FlightClassRepository";

export class FlightClassRepository implements IFlightClassRepository  {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.flightClass
    }
}
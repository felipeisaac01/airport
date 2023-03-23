import { PrismaClient } from "@prisma/client";
import { IFlightClassesDTO } from "../domain/dtos/controllers/FlightClasses";
import { IFlightClassRepository } from "../domain/interfaces/repositories/FlightClassRepository";

export class FlightClassRepository implements IFlightClassRepository  {
    constructor(private client: PrismaClient) {}

    async create(data: IFlightClassesDTO) {
        return this.client.flightClasses.create({ data })
    }
}
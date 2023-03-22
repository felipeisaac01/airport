import { PrismaClient } from "@prisma/client";
import { IFlightClassRepository } from "../domain/interfaces/repositories/FlightClassRepository";

export class FlightClassRepository implements IFlightClassRepository  {
    constructor(private client: PrismaClient) {}
}
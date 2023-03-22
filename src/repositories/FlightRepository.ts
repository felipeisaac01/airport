import { PrismaClient } from "@prisma/client";
import { IFlightRepository } from "../domain/interfaces/repositories/FlightRepository";

export class FlightRepository implements IFlightRepository {
    constructor(private client: PrismaClient) {}
}
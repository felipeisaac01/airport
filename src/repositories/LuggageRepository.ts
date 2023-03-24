import { PrismaClient } from "@prisma/client";
import { ILuggageRepository } from "../domain/interfaces/repositories/LuggageRepository";

export class LuggageRepository implements ILuggageRepository {
    private client
    constructor(private prisma: PrismaClient) {
        this.client = prisma.luggage
    }
}
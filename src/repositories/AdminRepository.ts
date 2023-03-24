import { PrismaClient } from "@prisma/client";
import { IAdminRepository } from "../domain/interfaces/repositories/AdminRepository";

export class AdminRepository implements IAdminRepository {
    private client;
    constructor(private prisma: PrismaClient) {
        this.client = prisma.admin
    }

    async get(username: string) {
        return this.client.findFirst({ where: { username } });
    }
}
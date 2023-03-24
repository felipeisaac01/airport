import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../domain/interfaces/repositories/UserRepository";

export class UserRepository implements IUserRepository {
    private client;
    constructor(private prisma: PrismaClient) {
        this.client = prisma.user
    }

    async get(username: string) {
        return this.client.findFirst({ where: { username, deletedAt: null } });
    }

    async getById(id: string) {
        return this.client.findFirst({ where: { id, deletedAt: null }})
    }
}
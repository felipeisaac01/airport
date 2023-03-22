import { PrismaClient } from "@prisma/client";
import { IAdminRepository } from "../domain/interfaces/repositories/AdminRepository";

export class AdminRepository implements IAdminRepository {
    constructor(private client: PrismaClient) {}

    async get(user: string) {
        return this.client.admin.findFirst({ where: { user } });
    }
}
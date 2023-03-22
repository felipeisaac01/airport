import { Admin } from "@prisma/client";

export interface IAdminRepository {
    get: (user: string) => Promise<Admin | null>
}
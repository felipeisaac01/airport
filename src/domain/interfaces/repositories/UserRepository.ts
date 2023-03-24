import { User } from "@prisma/client";

export interface IUserRepository {
    get: (user: string) => Promise<User | null>
}
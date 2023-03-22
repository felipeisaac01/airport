import { Airport } from "@prisma/client";

export interface IAirportRepository {
    getAll: () => Promise<Airport[]>
}
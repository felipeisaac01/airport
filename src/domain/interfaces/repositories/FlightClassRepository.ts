import { FlightClass } from "@prisma/client";
import { FlightClassType } from "../../dtos/controllers/flight";

export interface IFlightClassRepository {
    get: (id: string) => Promise<FlightClass | null>,
    getByFlightAndType: (flightId: string, type: FlightClassType) =>Promise<FlightClass | null>
}
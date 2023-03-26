import { FlightClass } from "@prisma/client";
import { FlightClassType } from "../../dtos/controllers/flight";
import { 
    ICreateMethodDto,
    IGetFilteredClassesForPurchaseDto, 
    IGetFilteredClassesForPurchaseResponseDto,
    IUpdateMethodDto
} from "../../dtos/repositories/FlightClassRepository";

export interface IFlightClassRepository {
    get: (id: string) => Promise<FlightClass | null>,
    getByFlightAndType: (flightId: string, type: FlightClassType) =>Promise<FlightClass | null>
    getFilteredClassesForPurchase: (data: IGetFilteredClassesForPurchaseDto) => Promise<IGetFilteredClassesForPurchaseResponseDto[]>
    create: (data: ICreateMethodDto) => Promise<FlightClass>
    update: (data: IUpdateMethodDto) => Promise<FlightClass>
}
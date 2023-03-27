import { Flight } from "@prisma/client";
import { 
    ICancelFlightResponseDto, 
    ICreateFlightMethodDto, 
    ICreateFlightMethodResponseDto, 
    IGetFlightMethodDto, 
    IGetFlightPassengersMethodResponse, 
    IUpdateFlightMethodDto, 
    IUpdateFlightMethodResponseDto 
} from "../../dtos/repositories/FlightRepository";

export interface IFlightRepository {
    createFlightWithClasses: (data: ICreateFlightMethodDto) => Promise<ICreateFlightMethodResponseDto>
    get: (id: string) => Promise<IGetFlightMethodDto | null>
    update: (id: string, data: IUpdateFlightMethodDto) => Promise<IUpdateFlightMethodResponseDto>
    cancel: (id: string) => Promise<ICancelFlightResponseDto>
    checkIfCodeIsInUse: (code: string, id: string) => Promise<Flight | null>
    getFlightPassengers: (flightId: string) => Promise<IGetFlightPassengersMethodResponse | null>
}
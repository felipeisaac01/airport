import { 
    ICancelFlightResponseDto, 
    ICreateFlightMethodDto, 
    ICreateFlightMethodResponseDto, 
    IGetFlightMethodDto, 
    IUpdateFlightMethodDto, 
    IUpdateFlightMethodResponseDto 
} from "../../dtos/repositories/FlightRepository";

export interface IFlightRepository {
    createFlightWithClasses: (data: ICreateFlightMethodDto) => Promise<ICreateFlightMethodResponseDto>
    get: (id: string) => Promise<IGetFlightMethodDto | null>
    update: (id: string, data: IUpdateFlightMethodDto) => Promise<IUpdateFlightMethodResponseDto>
    cancel: (id: string) => Promise<ICancelFlightResponseDto>
}
import { ICreateFlightMethodDTO, ICreateFlightMethodResponseDTO } from "../../dtos/repositories/FlightRepository";

export interface IFlightRepository {
    createFlightWithClasses: (data: ICreateFlightMethodDTO) => Promise<ICreateFlightMethodResponseDTO>
}
import { 
    ICreateTicketItemMethodDto, 
    ICreateTicketItemMethodResponseDto 
} from "../../dtos/repositories/TicketRepository"

export interface ITicketRepository {
    getCountByClass: (flightClassId: string) => Promise<number>
    createTickets: (data: ICreateTicketItemMethodDto[]) => Promise<ICreateTicketItemMethodResponseDto[]> 
}
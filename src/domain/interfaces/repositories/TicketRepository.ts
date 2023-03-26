import { Ticket } from "@prisma/client"
import { 
    ICreateTicketItemMethodDto, 
    ICreateTicketItemMethodResponseDto, 
    IGetEmissionInfoByTicketIdResponseDto
} from "../../dtos/repositories/TicketRepository"

export interface ITicketRepository {
    getCountByClass: (flightClassId: string) => Promise<number>
    createTickets: (data: ICreateTicketItemMethodDto[]) => Promise<ICreateTicketItemMethodResponseDto[]> 
    getTicketCountByclassesIds: (flightClassesIds: string[]) => Promise<Array<{ flightClassId: string, _count: { id: number } }>>
    getTicketById: (id: string) => Promise<Ticket | null>
    getEmissionInfoByTicketId: (id: string) => Promise<IGetEmissionInfoByTicketIdResponseDto | null>
}
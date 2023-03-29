import { Ticket } from "@prisma/client"
import { 
    ICancelPurchaseMethodResponseDto,
    ICreateTicketItemMethodDto, 
    ICreateTicketItemMethodResponseDto, 
    IGetEmissionInfoByTicketIdResponseDto,
    IGetFlightInfoMethodResponseDto,
    IGetTicketsBybuyerIdDto
} from "../../dtos/repositories/TicketRepository"

export interface ITicketRepository {
    getCountByClass: (flightClassId: string) => Promise<number>
    createTickets: (data: ICreateTicketItemMethodDto[]) => Promise<ICreateTicketItemMethodResponseDto[]> 
    getTicketCountByclassesIds: (flightClassesIds: string[]) => Promise<Array<{ flightClassId: string, _count: { id: number } }>>
    getTicketById: (id: string) => Promise<Ticket | null>
    getEmissionInfoByTicketId: (id: string) => Promise<IGetEmissionInfoByTicketIdResponseDto | null>
    getTicketsBybuyerId: (buyerId: string) => Promise<IGetTicketsBybuyerIdDto[]>
    cancelTicket: (id: string) => Promise<ICancelPurchaseMethodResponseDto>
    getFlightInfo: (ticketId: string) => Promise<IGetFlightInfoMethodResponseDto| undefined>
}
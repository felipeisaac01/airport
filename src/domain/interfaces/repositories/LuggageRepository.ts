import { IGetByTicketIdDto } from "../../dtos/repositories/LugaggeRepository";

export interface ILuggageRepository {
    getByTicketId: (ticketId: string) => Promise<IGetByTicketIdDto | null>
}
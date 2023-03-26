import { Request, Response } from "express";
import { IEmitLuggageTicketResponseDto } from "../domain/dtos/controllers/luggage";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { repositories } from "../repositories";

export async function emitLuggageTicket(req: Request<{ ticketId: string }>, res: Response<IEmitLuggageTicketResponseDto>) {
    const { ticketId } = req.params
    
    const ticket = await repositories.ticket.getTicketById(ticketId);
    
    if (!ticket) {
        throw new NotFoundError("Ticket not found.", "ELT-01")
    }

    const luggage = await repositories.luggage.getByTicketId(ticketId)

    if (!luggage) {
        throw new BadRequestError("Given ticket does not have luggage", "ELT-02")
    }

    return res.send({
        luggageCode: luggage.code,
        ticketCode: luggage.ticket.code,
        passengerName: luggage.ticket.name
    })
}
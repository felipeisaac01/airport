import { subHours } from "date-fns";
import { Request, Response } from "express";
import { IEmitLuggageTicketResponseDto } from "../domain/dtos/controllers/luggage";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { repositories } from "../repositories";

export async function emitLuggageTicket(req: Request<{ ticketId: string }>, res: Response<IEmitLuggageTicketResponseDto>) {
    const { ticketId } = req.params;
    
    const ticket = await repositories.ticket.getTicketById(ticketId);
    
    if (!ticket) {
        throw new NotFoundError("Ticket not found.", "ELT-01");
    }

    if (ticket.canceled) {
        throw new BadRequestError("This ticket was canceled", "ELT-02");
    }
    
    const luggage = await repositories.luggage.getByTicketId(ticketId);

    if (!luggage) {
        throw new BadRequestError("Given ticket does not have luggage", "ELT-03");
    }

    const { departureTime, status } = (await repositories.ticket.getFlightInfo(ticketId))!;

    if (new Date() < subHours(departureTime, 5)) {
        throw new BadRequestError("You can only emit tickets 5 hours before departure time.", "ELT-04");
    }

    if (new Date() > departureTime) {
        throw new BadRequestError("Flight has already left", "ELT-05");
    }

    if (status === "CANCELED") {
        throw new BadRequestError("Given flight was canceled", "ELT-06");
    }

    return res.send({
        luggageCode: luggage.code,
        ticketCode: luggage.ticket.code,
        passengerName: luggage.ticket.name
    })
}
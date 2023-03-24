import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { getTokeninfo } from "../helpers/auth";
import { repositories } from "../repositories";
import { isValid as validateCpf } from "@fnando/cpf"
import { IPurchasedTicketDto, IPurchaseTicketDto } from "../domain/dtos/controllers/tickets";
import { ICreateTicketItemMethodDto } from "../domain/dtos/repositories/TicketRepository";
import { generateRandomCode } from "../helpers/randomCode";
import { bodyValidator } from "../helpers/bodyValidator";
import { purchaseTicketBodyValidator } from "../validator/ticket";

export async function purchaseTicket(req: Request<{}, {}, IPurchaseTicketDto>, res: Response<IPurchasedTicketDto[]>) {
    bodyValidator(purchaseTicketBodyValidator, req.body, "PT")
    const { flightId,classType, passengers } = req.body
    const { userId } = await getTokeninfo(req.headers.authorization!)

    const user = (await repositories.user.getById(userId))!;

    const flight = await repositories.flight.get(flightId)

    if (!flight) {
        throw new NotFoundError("Flight not found.", "PT-02")
    }

    const flightClass = await repositories.flightClass.getByFlightAndType(flightId, classType) 

    if (!flightClass) {
        throw new NotFoundError("Flight class not found.", "PT-03")
    }

    const classExistingTickets = await repositories.ticket.getCountByClass(flightClass.id)

    if (flightClass.quantity < classExistingTickets + passengers.length) {
        throw new BadRequestError("Flight class capacity already reached.", "PT-04")
    }

    const ticketsToBeCreated: ICreateTicketItemMethodDto[] = []

    for (const passenger of passengers) {
        if (!validateCpf(passenger.cpf)) {
            throw new BadRequestError(`${passenger.name}'s CPF is not valid`, "PT-05")
        }

        ticketsToBeCreated.push({
            ...passenger,
            luggage: passenger.luggage ? generateRandomCode(8, "ALPHANUMERIC") : undefined,
            flightClassId: flightClass.id,
            buyerId: user.id,
            totalValue: passenger.luggage ? Math.round(flightClass.value*1.1) : flightClass.value,
            code: generateRandomCode(6, "ALPHANUMERIC")
        })
    }
    const ticketsCreated = await repositories.ticket.createTickets(ticketsToBeCreated)

    return res.status(201).send(ticketsCreated.map(ticket => {
        return {
            lugaggeCode: ticket.luggage?.code,
            code: ticket.code,
            passenger: {
                name: ticket.name,
                cpf: ticket.cpf,
                birthdate: ticket.birthdate
            },
            flight: {
                departureTime: ticket.flightClass.flight.departureTime,
                departureAirport: ticket.flightClass.flight.departureAirport.iataCode,
                destinationAirport: ticket.flightClass.flight.destinationAirport.iataCode,
                class: ticket.flightClass.type,
                code: ticket.flightClass.flight.code
            }
        }
    }))
}
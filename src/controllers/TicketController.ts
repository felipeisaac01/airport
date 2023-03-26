import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { getTokeninfo } from "../helpers/auth";
import { repositories } from "../repositories";
import { isValid as validateCpf } from "@fnando/cpf"
import { 
    IEmitTicketResponseDto,
    IGetAvailableTicketsForPurchaseResponseDto, 
    IGetTicketsForPurchaseParamsDto, 
    IPurchasedTicketDto, 
    IPurchaseTicketDto 
} from "../domain/dtos/controllers/ticket";
import { ICreateTicketItemMethodDto } from "../domain/dtos/repositories/TicketRepository";
import { generateRandomCode } from "../helpers/randomCode";
import { bodyValidator } from "../helpers/bodyValidator";
import { getTicketsForPurchaseQueryValidator, purchaseTicketBodyValidator } from "../validator/ticket";
import { isPast, subHours } from "date-fns";

export async function purchaseTicket(req: Request<{ flightId: string }, {}, IPurchaseTicketDto>, res: Response<IPurchasedTicketDto[]>) {
    bodyValidator(purchaseTicketBodyValidator, req.body, "PT");
    const { classType, passengers } = req.body;
    const { flightId } = req.params;
    const { userId } = await getTokeninfo(req.headers.authorization!);

    const user = (await repositories.user.getById(userId))!;

    const flight = await repositories.flight.get(flightId);

    if (!flight) {
        throw new NotFoundError("Flight not found.", "PT-02");
    }

    const flightClass = await repositories.flightClass.getByFlightAndType(flightId, classType);

    if (!flightClass) {
        throw new NotFoundError("Flight class not found.", "PT-03");
    }

    const classExistingTickets = await repositories.ticket.getCountByClass(flightClass.id);

    if (flightClass.quantity < classExistingTickets + passengers.length) {
        throw new BadRequestError("Flight class capacity already reached.", "PT-04");
    }

    const ticketsToBeCreated: ICreateTicketItemMethodDto[] = [];

    for (const passenger of passengers) {
        if (!validateCpf(passenger.cpf)) {
            throw new BadRequestError(`${passenger.name}'s CPF is not valid`, "PT-05");;
        }

        ticketsToBeCreated.push({
            ...passenger,
            luggage: passenger.luggage ? generateRandomCode(8, "ALPHANUMERIC") : undefined,
            flightClassId: flightClass.id,
            buyerId: user.id,
            totalValue: passenger.luggage ? Math.round(flightClass.value*1.1) : flightClass.value,
            code: generateRandomCode(6, "ALPHANUMERIC")
        });
    }

    const ticketsCreated = await repositories.ticket.createTickets(ticketsToBeCreated);

    return res.status(201).send(ticketsCreated.map(ticket => {
        return {
            id: ticket.id,
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
    }));
}

export async function getAvailableTicketsForPurchase(
    req: Request<{}, {}, {}, IGetTicketsForPurchaseParamsDto>, 
    res: Response<IGetAvailableTicketsForPurchaseResponseDto[]>
) {
    bodyValidator(getTicketsForPurchaseQueryValidator, req.query, "GTP")
    const { departureAirportCode, destinationAirportCode } = req.query; 
    const dateString = req.query.date
    const maxValue = req.query.maxValue ? parseInt(req.query.maxValue) : undefined
    const minValue = req.query.minValue ? parseInt(req.query.minValue) : undefined

    const departureAirport = await repositories.airport.getByCode(departureAirportCode)

    if (!departureAirport) {
        throw new NotFoundError("Departure airport not found.", "GTP-02")
    }

    const destinationAirport = await repositories.airport.getByCode(destinationAirportCode)

    if (!destinationAirport) {
        throw new NotFoundError("Destination airport not found.", "GTP-03")
    }

    const date = dateString ? new Date(dateString) : undefined

    if (date) {
        if (isNaN(date.valueOf())) {
            throw new BadRequestError("Given date is not valid.", "GTP-04")
        }

        if (isPast(date)) {
            throw new BadRequestError("Given date mus be in the future", "GTP-05")
        }
    }


    if (maxValue) {
        if (isNaN(maxValue)) {
            throw new BadRequestError("maxValue must be a number", "GTP-06")
        }

        if (maxValue <= 0) {
            throw new BadRequestError("maxValue must be greater than zero.", "GTP-07")
        }
    }

    if (minValue) {
        if (isNaN(minValue)) {
            throw new BadRequestError("minValue must be a number", "GTP-08")
        }

        if (minValue < 0) {
            throw new BadRequestError("minValue must be, at least, zero.", "GTP-09")
        }
    }

    const filteredClasses = await repositories.flightClass.getFilteredClassesForPurchase({
        date,
        departureAirportCode,
        destinationAirportCode,
        maxValue,
        minValue
    })

    const ticketsSold = await repositories.ticket.getTicketCountByclassesIds(filteredClasses.map(item => item.id));
    const availableClasses = [];

    for (const flightClass of filteredClasses) {
        const flightClassCount = ticketsSold.find(item => item.flightClassId === flightClass.id)
        if (!flightClassCount || (flightClassCount && flightClassCount._count.id < flightClass.quantity)) {
            availableClasses.push(flightClass)
        }
    }

    return res.send(availableClasses)
}

export async function emitTicket(req: Request<{ ticketId: string }>, res: Response<IEmitTicketResponseDto>) {
    const { ticketId } = req.params
    // console.log({ticketId})
    
    const ticket = await repositories.ticket.getTicketById(ticketId);
    // console.log({ticket})
    
    if (!ticket) {
        throw new NotFoundError("Ticket not found.", "ET-01")
    }
    
    const emissionInfo = (await repositories.ticket.getEmissionInfoByTicketId(ticketId))!
    

    console.log({emissionInfo})

    if (new Date() < subHours(emissionInfo.flightClass.flight.departureTime, 5)) {
        throw new BadRequestError("You can only emit tickets 5 hours before departure time.", "ET-02")
    }

    if (new Date() > emissionInfo.flightClass.flight.departureTime) {
        throw new BadRequestError("Flight has already left", "ET-03")
    }

    res.send({
        flightCode: emissionInfo.flightClass.flight.code,
        ticketCode: emissionInfo.code,
        departureAirport: emissionInfo.flightClass.flight.departureAirport.iataCode,
        destinationAirport: emissionInfo.flightClass.flight.destinationAirport.iataCode,
        passenger: {
            cpf: emissionInfo.cpf,
            birthdate: emissionInfo.birthdate,
            name: emissionInfo.name
        },
        luggage: Boolean(emissionInfo.luggage),
    })
}
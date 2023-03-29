
import { 
    ICreateFlightResponseDto, 
    ICreateFlightDto, 
    IUpdateFlightDto, 
    IUpdateFlightResponseDto,
    ICancelFlightResponseDto,
    IGetFlightsResponseDto,
    IGetFlightPassengersDto
} from "../domain/dtos/controllers/flight";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { repositories } from "../repositories";
import { generateRandomCode } from "../helpers/randomCode"
import { bodyValidator } from "../helpers/bodyValidator";
import { createFlightBodyValidator, updateFlightBodyValidator } from "../validator/flight";
import { prismaClient } from "../prisma";
import { Request, Response } from "express";
import { format } from "@fnando/cpf"
import { dateParser } from "../helpers/dateParser";

export async function createFlight(req: Request<{}, {}, ICreateFlightDto>, res: Response<ICreateFlightResponseDto>) {
    bodyValidator(createFlightBodyValidator, req.body, "CF")
    const { departureAirportId, destinationAirportId, classes, departureTime } = req.body

    const departureAirport = await repositories.airport.get(departureAirportId);
    
    if (!departureAirport) {
        throw new NotFoundError("Departure airport not found.", "CF-02");
    }

    const destinationAirport = await repositories.airport.get(destinationAirportId);

    if (!destinationAirport) {
        throw new NotFoundError("Destination airport not found.", "CF-03");
    }

    if (departureAirport.id === destinationAirport.id) {
        throw new BadRequestError("Departure airport and destination airport must be different.", "CF-04");
    }

    if (departureAirport.cityId === destinationAirport.cityId) {
        throw new BadRequestError("Departure airport and destination airport must be in different cities.", "CF-05");
    }

    if (!classes.length) {
        throw new BadRequestError("Flight must have at least one class.", "CF-06")
    } else if (classes.length > 1) {
        for (const flightClass of classes) {
            if (classes.filter(item => item.type === flightClass.type).length > 1) {
                throw new BadRequestError("There can not be more the one class of a type in a flight.", "CF-07")
            } 
        }
    }

    const flight = await repositories.flight.createFlightWithClasses({ 
        destinationAirportId,
        departureAirportId,
        departureTime: dateParser(departureTime),
        code: generateRandomCode(4, "NUMERIC"),
        classes
    })

    return res.status(201).send(flight)
}

export async function updateFlight(req: Request<{ flightId: string }, {} , IUpdateFlightDto>, res: Response<IUpdateFlightResponseDto>) {
    bodyValidator(updateFlightBodyValidator, req.body, "UF")
    const { flightId } = req.params
    const { departureAirportId, departureTime, destinationAirportId, code } = req.body;

    const flight = await repositories.flight.get(flightId);

    if (!flight) {
        throw new NotFoundError("Flight not found.", "UF-02")
    }

    if (departureAirportId && !destinationAirportId) {
        const departureAirport = await repositories.airport.get(departureAirportId);

        if (!departureAirport) {
            throw new NotFoundError("Departure airport not found.", "UF-03");
        }

        if (flight.destinationAirport.id === departureAirport.id) {
            throw new BadRequestError("Departure airport and destination airport must be different.", "UF-04");
        }

        if (flight.destinationAirport.cityId === departureAirport.cityId) {
            throw new BadRequestError("Departure airport and destination airport must be in different cities.", "UF-05");
        }
    } else if (!departureAirportId && destinationAirportId) {
        const destinationAirport = await repositories.airport.get(destinationAirportId);

        if (!destinationAirport) {
            throw new NotFoundError("Destination airport not found.", "UF-06");
        }

        if (destinationAirport.id === flight.departureAirport.id) {
            throw new BadRequestError("Departure airport and destination airport must be different.", "UF-07");
        }

        if (destinationAirport.cityId === flight.departureAirport.cityId) {
            throw new BadRequestError("Departure airport and destination airport must be in different cities.", "UF-08");
        }
    } else if (departureAirportId && destinationAirportId) {
        const departureAirport = await repositories.airport.get(departureAirportId);

        if (!departureAirport) {
            throw new NotFoundError("Departure airport not found.", "UF-09");
        }

        const destinationAirport = await repositories.airport.get(destinationAirportId);

        if (!destinationAirport) {
            throw new NotFoundError("Destination airport not found.", "UF-10");
        }

        if (departureAirport.id === destinationAirport.id) {
            throw new BadRequestError("Departure airport and destination airport must be different.", "UF-11");
        }

        if (destinationAirport.cityId === departureAirport.cityId) {
            throw new BadRequestError("Departure airport and destination airport must be in different cities.", "UF-12");
        }
    }

    if (code) {
        const existingFlightWithCode = await repositories.flight.checkIfCodeIsInUse(code, flightId);

        if (existingFlightWithCode) {
            throw new BadRequestError("Given code already in use", "UF-13")
        }
    }

    if (flight.status === "CANCELED") {
        throw new BadRequestError("Given flight was canceled", "UF-13")
    }

    const updatedFlight = await repositories.flight.update(flightId, {
        code,
        departureAirportId,
        destinationAirportId,
        departureTime: departureTime ? dateParser(departureTime) : undefined,
    })

    return res.send(updatedFlight)
}

export async function cancelFlight(req: Request<{ flightId: string }>, res: Response<ICancelFlightResponseDto>) {
    const { flightId } = req.params;

    const flight = await repositories.flight.get(flightId);

    if (!flight) {
        throw new NotFoundError("Flight not found.", "CLF-01")
    }

    const canceledFlight = await repositories.flight.cancel(flightId)

    return res.send({ status: canceledFlight.status })
}

export async function getFlights(req: Request, res: Response<IGetFlightsResponseDto[]>) {
    const flights = await repositories.flight.getFlights();

    return res.send(flights)
}

export async function getFlightPassengers(req: Request<{ flightId: string }>, res: Response<IGetFlightPassengersDto>) {
    const { flightId } = req.params;
    

    const flights = await repositories.flight.get(flightId);


    if (!flights) {
        throw new BadRequestError("Flight not found", "GFP-01");
    }

    const passengers = (await repositories.ticket.getTicketsByFlightId(flightId)).map(ticket => {
        return {
            class: ticket.flightClass.type,
            name: ticket.name,
            birthdate: ticket.birthdate,
            code: ticket.code,
            cpf: format(ticket.cpf)
        }
    })


    return res.send({ passengers })
}
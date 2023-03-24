import { Request, Response } from "express";
import { ICreateFlightResponseDto, ICreateFlightDto, IUpdateFlightDto, IUpdateFlightResponseDto, ICancelFlightDto, ICancelFlightResponseDto } from "../domain/dtos/controllers/flight";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { repositories } from "../repositories";
import { generateFlightCode } from "../helpers/flightCode"
import { bodyValidator } from "../helpers/bodyValidator";
import { cancelFlightBodyValidator, createFlightBodyValidator, updateFlightBodyValidator } from "../validator/flight";

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
        departureTime,
        code: generateFlightCode(),
        classes
    })

    return res.status(201).send(flight)
}

export async function updateFlight(req: Request<{}, {}, IUpdateFlightDto>, res: Response<IUpdateFlightResponseDto>) {
    bodyValidator(updateFlightBodyValidator, req.body, "UF")
    const { flightId, departureAirportId, departureTime, destinationAirportId,code } = req.body;

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

    if (departureTime && departureTime <= new Date()) {

        throw new BadRequestError("Departure time must be a future moment.", "UF-13");
    }

    const updatedFlight = await repositories.flight.update(flightId, { 
        code, 
        departureAirportId, 
        departureTime, 
        destinationAirportId 
    })

    return res.send(updatedFlight)
}

export async function cancelFlight(req: Request<{}, {}, ICancelFlightDto>, res: Response<ICancelFlightResponseDto>) {
    bodyValidator(cancelFlightBodyValidator, req.body, "CLF")
    const { flightId } = req.body;

    const flight = await repositories.flight.get(flightId);

    if (!flight) {
        throw new NotFoundError("Flight not found.", "CLF-02")
    }

    const canceledFlight = await repositories.flight.cancel(flightId)

    return res.send({ status: canceledFlight.status })
}
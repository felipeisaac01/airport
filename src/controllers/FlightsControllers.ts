import { Request, Response } from "express";
import { ICreateFlightResponseDto, ICreateFlightDto } from "../domain/dtos/controllers/flight";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { repositories } from "../repositories";
import { generateFlightCode } from "../helpers/flightCode"
import { bodyValidator } from "../helpers/bodyValidator";
import { createFlightBodyValidator } from "../validator/flight";

export async function createFlight(req: Request<{}, {}, ICreateFlightDto>, res: Response<ICreateFlightResponseDto>) {
    bodyValidator(createFlightBodyValidator, req.body, "CF")
    const { departureAirportId, destinationAirportId, classes, departureTime } = req.body


    const departureAirport = await repositories.airport.get(departureAirportId);
    
    if (!departureAirport) {
        throw new NotFoundError("Departure airport not found", "CF-02");
    }

    const destinationAirport = await repositories.airport.get(destinationAirportId);

    if (!destinationAirport) {
        throw new NotFoundError("Destination airport not found", "CF-03");
    }

    if (departureAirport.id === destinationAirport.id) {
        throw new BadRequestError("Departure airport and destination airport must be different", "CF-04");
    }

    if (departureAirport.cityId === destinationAirport.cityId) {
        throw new BadRequestError("Departure airport and destination airport must be in different cities", "CF-05");
    }

    if (!classes.length) {
        throw new BadRequestError("Flight must have at least one class", "CF-06")
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



import { 
    ICreateFlightResponseDto, 
    ICreateFlightDto, 
    IUpdateFlightDto, 
    IUpdateFlightResponseDto,
    ICancelFlightResponseDto,
    IGetFlightsResponseDto
} from "../domain/dtos/controllers/flight";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { repositories } from "../repositories";
import { generateRandomCode } from "../helpers/randomCode"
import { bodyValidator } from "../helpers/bodyValidator";
import { createFlightBodyValidator, updateFlightBodyValidator } from "../validator/flight";
import { prismaClient } from "../prisma";
import { Request, Response } from "express";

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
        code: generateRandomCode(4, "NUMERIC"),
        classes
    })

    return res.status(201).send(flight)
}

export async function updateFlight(req: Request<{ flightId: string }, {} , IUpdateFlightDto>, res: Response<IUpdateFlightResponseDto>) {
    bodyValidator(updateFlightBodyValidator, req.body, "UF")
    const { flightId } = req.params
    const { departureAirportId, departureTime, destinationAirportId, code, classes } = req.body;

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

    const necessaryDatabaseCalls = []

    necessaryDatabaseCalls.push(prismaClient.flight.update({
        where: { id:flightId },
        data: {
            code,
            departureAirportId,
            destinationAirportId,
            departureTime,
        },
        select: {
            code: true,
            departureTime: true,
            id: true,
            departureAirport: {
                select: {
                    iataCode: true,
                    name: true,
                    id: true
                }
            },
            destinationAirport: {
                select: {
                    iataCode: true,
                    name: true,
                    id: true
                }
            },
        }
    }))

    if (classes) {
        if (!classes.length) {
            throw new BadRequestError("Flights must have at least one class", "UF-14")
        }

        for (const flightClass of classes) {
            if (classes.filter(item => item.type === flightClass.type).length > 1) {
                throw new BadRequestError("There can not be two classes with the same type", "UF-15")
            }
        }

        const classesToUpdate = [];
        const classesToCreate = [];
        let classesToDelete = flight.flightClasses;
    
        for (const flightClass of classes) {
            const [existingClass] = flight.flightClasses.filter(item => item.type === flightClass.type)

            if (existingClass) {
                classesToUpdate.push({
                    id: existingClass.id,
                    ...flightClass
                })
                classesToDelete = classesToDelete.filter(item => item.type !== flightClass.type)
                continue
            }

            classesToCreate.push({ flightId, ...flightClass})
        }

        if (classesToCreate.length) {
            necessaryDatabaseCalls.push(
                prismaClient.flightClass.createMany({
                    data: classesToCreate
                })
            )
        }
    
        if (classesToUpdate.length) {
            for (const classToUpdate of classesToUpdate) {
                const ticketsSold = await repositories.ticket.getCountByClass(classToUpdate.id);

                if (ticketsSold > classToUpdate.quantity) {
                    throw new BadRequestError(
                        `There are more tickets sold to the ${classToUpdate.type} class than the new value for quantity.`,
                        "UF-16"
                    )
                }

                necessaryDatabaseCalls.push(
                    prismaClient.flightClass.update({
                        where: { id: classToUpdate.id },
                        data: {
                            quantity: classToUpdate.quantity,
                            value: classToUpdate.value,
                        }
                    })
                )
            }
        }
    
        if (classesToDelete.length) {
            necessaryDatabaseCalls.push(
                prismaClient.flightClass.deleteMany({
                    where: {
                         id: { 
                            in: classesToDelete.map(item => item.id ) 
                        } 
                    }
                })
            )
        }
    }

    await prismaClient.$transaction(necessaryDatabaseCalls)


    const updatedFlight = (await repositories.flight.get(flightId))!

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
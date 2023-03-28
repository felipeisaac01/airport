import { Request, Response } from "express";
import { ICreateClassDto, ICreateClassResponseDto, IUpdateClassDto, IUpdateClassResponseDto } from "../domain/dtos/controllers/flightClass";
import { BadRequestError, NotFoundError } from "../errors/apiErrors";
import { bodyValidator } from "../helpers/bodyValidator";
import { repositories } from "../repositories";
import { createClassBodyValidator, updateClassBodyValidator } from "../validator/flightClass";


export async function createFlightClass(req: Request<{}, {}, ICreateClassDto>, res: Response<ICreateClassResponseDto>) {
    bodyValidator(createClassBodyValidator, req.body, "CFC")
    const { type, flightId } = req.body;

    const flight = await repositories.flight.get(flightId);

    if (!flight) {
        throw new NotFoundError("Given flight not found", "CFC-02");
    }

    if (flight.flightClasses.some(item => item.type === type)) {
        throw new BadRequestError("Given flight already has a class of given type", "CFC-03");
    }

    const createdClass = await repositories.flightClass.create(req.body);

    return res.status(201).send(createdClass)
}

export async function updateFlightClass(req: Request<{}, {}, IUpdateClassDto>, res: Response<IUpdateClassResponseDto>) {
    bodyValidator(updateClassBodyValidator, req.body, "UFC")
    const { quantity, id } = req.body;

    const flightClass = await repositories.flightClass.get(id)

    if (!flightClass) {
    throw new NotFoundError("Given class not found", "UFC-02")
    }

    if (quantity) {
        const ticketsSold = await repositories.ticket.getCountByClass(id);

        if (ticketsSold > quantity) {
            throw new BadRequestError(
                `There are more tickets sold to this class than the new value for quantity.`,
                "UFC-03"
            )
        }
    }

    const updatedClass = await repositories.flightClass.update(req.body)

    return res.send(updatedClass)
}
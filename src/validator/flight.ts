import Joi from "joi";

export const createFlightBodyValidator = Joi.object({
    departureAirportId: Joi.string().required(), 
    destinationAirportId: Joi.string().required(),
    departureTime: Joi.date().greater("now").required(),
    classes: Joi.array().items(Joi.object({
        quantity: Joi.number().integer().required().min(1),
        value: Joi.number().integer().required().min(1),
        type: Joi.string().required().valid("A", "B", "C", "D", "E"),
    })).required(), 
})

export const updateFlightBodyValidator = Joi.object({
    flightId: Joi.string().required(),
    departureAirportId: Joi.string(), 
    destinationAirportId: Joi.string(),
    departureTime: Joi.date().greater("now"),
    code: Joi.string()
})
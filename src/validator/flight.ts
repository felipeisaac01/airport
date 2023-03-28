import Joi from "joi";

export const createFlightBodyValidator = Joi.object({
    departureAirportId: Joi.string().required(), 
    destinationAirportId: Joi.string().required(),
    departureTime: Joi.object({
        date: Joi.string().required(),
        time: Joi.string().required(),
    }),
    classes: Joi.array().items(Joi.object({
        quantity: Joi.number().integer().required().min(1),
        value: Joi.number().integer().required().min(1),
        type: Joi.string().required().valid("A", "B", "C", "D", "E"),
    })).required(), 
})

export const updateFlightBodyValidator = Joi.object({
    departureAirportId: Joi.string(), 
    destinationAirportId: Joi.string(),
    departureTime: Joi.object({
        date: Joi.string(),
        time: Joi.string(),
    }),
    code: Joi.string(),
})
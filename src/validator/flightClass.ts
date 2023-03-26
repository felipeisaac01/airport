import Joi from "joi";

export const createClassBodyValidator = Joi.object({
    quantity: Joi.number().integer().required().min(1),
    value: Joi.number().integer().required().min(1),
    type: Joi.string().required().valid("A", "B", "C", "D", "E"),
    flightId: Joi.string().required(),
})

export const updateClassBodyValidator = Joi.object({
    quantity: Joi.number().integer().min(1),
    value: Joi.number().integer().min(1),
    type: Joi.string().valid("A", "B", "C", "D", "E"),
    id: Joi.string().required(),
})


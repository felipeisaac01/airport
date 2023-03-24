import Joi from "joi";

export const purchaseTicketBodyValidator = Joi.object({
    flightId: Joi.string().required(),
    classType: Joi.string().required().valid("A", "B", "C", "D", "E"),
    passengers: Joi.array().required().items(Joi.object({
        cpf: Joi.string().required(),
        birthdate: Joi.date().max("now").required(),
        name: Joi.string().required(),
        luggage: Joi.bool().required()
    }))
})
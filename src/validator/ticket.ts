import Joi from "joi";

export const purchaseTicketBodyValidator = Joi.object({
    classType: Joi.string().required().valid("A", "B", "C", "D", "E"),
    passengers: Joi.array().required().items(Joi.object({
        cpf: Joi.string().required(),
        birthdate: Joi.date().max("now").required(),
        name: Joi.string().required(),
        luggage: Joi.bool().required()
    }))
})

export const getTicketsForPurchaseQueryValidator = Joi.object({
    departureAirportCode: Joi.string().required(),
    destinationAirportCode: Joi.string().required(),
    date: Joi.date(),
    minValue: Joi.string(),
    maxValue: Joi.string(),
})
import Joi from "joi";

export const loginBodySchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})
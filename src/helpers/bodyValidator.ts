import Joi from "joi"
import { BadRequestError } from "../errors/apiErrors"

export function bodyValidator (schema: Joi.ObjectSchema<any>, body: any, code: string) {
    const response = schema.validate(body)

    if (response.error) {
        throw new BadRequestError(response.error.details[0].message, `${code}-01`)
    }
}

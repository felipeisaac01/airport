import { IError } from "../domain/interfaces/Error";

export class ApiError implements IError {
    status;
    message;
    code;
    constructor(message: string, code: string, status: number = 500) {
        this.status = status;
        this.message = message
        this.code = code
    } 
}

export class BadRequestError extends ApiError {
    constructor(message: string, code: string) {
        super(message, code, 400)
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string, code: string) {
        super(message, code, 401)
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string, code: string) {
        super(message, code, 404)
    }
}
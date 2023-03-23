import { FlightClassType } from "../controllers/FlightClasses";

export interface ICreateFlightMethodDto {
    code: string;
    departureTime: Date;
    departureAirportId: string;
    destinationAirportId: string;
    classes: {
        quantity: number;
        type: FlightClassType;
        value: number;
    }[]
}

export interface ICreateFlightMethodResponseDto {
    id: string,
    code: string,
    createdAt: Date,
    departureTime: Date,
    status: string,
    departureAirport: {
        iataCode: string,
        name: string,
        id: string
    },
    destinationAirport: {
        iataCode: string,
        name: string,
        id: string
    },
    flightClasses: {
        value: number,
        quantity: number,
        type: string,
        id: string
    }[],
}

export interface IGetFlightMethodDto {
    code: string,
    departureTime: Date,
    id: string,
    departureAirport: {
        cityId: string,
        id: string
    },
    destinationAirport: {
        cityId: string,
        id: string
    },
}

export interface IUpdateFlightMethodDto {
    code: string | undefined,
    departureTime: Date | undefined,
    departureAirportId: string | undefined,
    destinationAirportId: string | undefined,
}

export interface IUpdateFlightMethodResponseDto {
    id: string,
    code: string,
    departureTime: Date,
    departureAirport: {
        iataCode: string,
        name: string,
        id: string
    },
    destinationAirport: {
        iataCode: string,
        name: string,
        id: string
    }
}
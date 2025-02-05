import { FlightClassOptions } from "@prisma/client";
import { FlightClassType } from "../controllers/flight";

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
    status: "CONFIRMED" | "CANCELED"
    departureAirport: {
        cityId: string,
        id: string
    },
    destinationAirport: {
        cityId: string,
        id: string
    },
    flightClasses:{
        id: string;
        type: string,
    }[]
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

export interface ICancelFlightResponseDto {
    status: string
}

export interface IGetFlightPassengersMethodResponse {
    flightClasses: {
        type: FlightClassOptions;
        tickets: {
            buyerId: string;
            birthdate: Date;
            cpf: string;
            name: string;
            code: string;
        }[];
    }[]
}
import { FlightClassType } from "../controllers/FlightClasses";

export interface ICreateFlightMethodDTO {
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

export interface ICreateFlightMethodResponseDTO {
    id: string,
    code: string,
    createdAt: Date,
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
    },
    flightClasses: {
        value: number,
        quantity: number,
        type: string,
        id: string
    }[],
}
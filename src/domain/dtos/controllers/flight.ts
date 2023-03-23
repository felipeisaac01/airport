import { IFlightClassesDTO } from "./FlightClasses";

export interface ICreateFlightDto {
    departureAirportId: string;
    destinationAirportId: string;
    classes: IFlightClassesDTO[];
    departureTime: Date;
}

export interface ICreateFlightResponseDto {
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
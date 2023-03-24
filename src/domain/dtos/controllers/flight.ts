import { IFlightClassesDto } from "./FlightClasses";

export interface ICreateFlightDto {
    departureAirportId: string;
    destinationAirportId: string;
    classes: IFlightClassesDto[];
    departureTime: Date;
}

export interface ICreateFlightResponseDto {
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

export interface IUpdateFlightDto {
    flightId: string;
    departureAirportId: string | undefined;
    destinationAirportId: string | undefined;
    departureTime: Date | undefined;
    code: string | undefined;
}

export interface IUpdateFlightResponseDto {
    departureTime: Date;
    id: string;
    code: string;
    departureAirport: {
        id: string;
        name: string;
        iataCode: string;
    };
    destinationAirport: {
        id: string;
        name: string;
        iataCode: string;
    };
}

export interface ICancelFlightDto {
    flightId: string
}

export interface ICancelFlightResponseDto {
    status: string
}
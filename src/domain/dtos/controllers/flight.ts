import { FlightClassOptions } from "@prisma/client";

export enum FlightClassType {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
}

export interface IFlightClassesDto {
    quantity: number;
    value: number,
    flightId: string;
    type: FlightClassType
}

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

export interface IUpdateFlightClassDto {
    quantity: number;
    value: number,
    type: FlightClassType
}

export interface IUpdateFlightDto {
    departureAirportId: string | undefined;
    destinationAirportId: string | undefined;
    departureTime: Date | undefined;
    code: string | undefined;
    classes: IUpdateFlightClassDto[] | undefined;
}

export interface IUpdateFlightResponseDto {
    departureTime: Date;
    id: string;
    code: string;
    departureAirport: {
        id: string;
        name: string;
        iataCode: string;
        cityId: string;
    };
    destinationAirport: {
        id: string;
        name: string;
        iataCode: string;
    };
    flightClasses: {
        id: string,
        type: string,
        value: number,
        quantity: number
    }[]
}

export interface ICancelFlightResponseDto {
    status: string
}

export interface IGetFlightsResponseDto {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    departureTime: Date;
    code: string;
    status: "CANCELED" | "CONFIRMED";
    departureAirport: {
        id: string;
        iataCode: string;
    };
    destinationAirport: {
        id: string;
        iataCode: string;
    };
}

export interface IGetFlightPassengersDto {
    passengers: {
        class: FlightClassOptions
        name: string;
        cpf: string;
        birthdate: Date;
        code: string;
    }[]
}
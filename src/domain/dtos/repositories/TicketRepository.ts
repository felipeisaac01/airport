import { FlightClassOptions, Luggage } from "@prisma/client";

export interface ICreateTicketItemMethodDto {
    flightClassId: string;
    buyerId: string;
    name: string;
    cpf: string;
    birthdate: Date;
    code: string;
    totalValue: number;
    luggage: string | undefined;
}

export interface ICreateTicketItemMethodResponseDto {
    id: string;
    code: string;
    name: string;
    cpf: string;
    birthdate: Date;
    flightClass: {
        type: FlightClassOptions;
        flight: {
            code: string;
            departureTime: Date;
            departureAirport: {
                iataCode: string;
            };
            destinationAirport: {
                iataCode: string;
            };
        };
    };
    luggage: {
        code: string;
    } | null;
}

export interface IGetTicketCountByclassesIds {
    flightClassId: string;
    count: { flightClassId: string }
}

export interface IGetEmissionInfoByTicketIdResponseDto {
    cpf: string;
    birthdate: Date;
    name: string;
    luggage: Luggage | null;
    code: string;
    flightClass: {
        type: FlightClassOptions;
        flight: {
            code: string;
            departureTime: Date;
            departureAirport: {
                iataCode: string;
            };
            destinationAirport: {
                iataCode: string;
            };
        };
    };
}
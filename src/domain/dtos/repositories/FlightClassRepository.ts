import { FlightClassOptions } from "@prisma/client";

export interface IGetFilteredClassesForPurchaseDto {
    departureAirportCode: string;
    destinationAirportCode: string;
    date: Date | undefined;
    minValue: number | undefined;
    maxValue: number | undefined;
} 

export interface IGetFilteredClassesForPurchaseResponseDto {
    id: string;
    type: FlightClassOptions;
    value: number;
    quantity: number;
    flight: {
        id: string;
        code: string;
        departureTime: Date;
    };
}

export interface ICreateMethodDto {
    quantity: number,
    value: number,
    flightId: string;
    type: FlightClassOptions
}

export interface IUpdateMethodDto {
    quantity: number | undefined,
    value: number | undefined,
    id: string;
}
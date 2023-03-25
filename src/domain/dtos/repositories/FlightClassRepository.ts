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
        code: string;
        departureTime: Date;
    };
}

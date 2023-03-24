import { FlightClassOptions } from "@prisma/client";
import { FlightClassType } from "./flight";

export interface IPurchaseTicketDto {
    flightId: string;
    classType: FlightClassType;
    passengers: {
        cpf: string,
        birthdate: Date,
        name: string
        luggage: true
    }[]
}

export interface IPurchasedTicketDto {
    lugaggeCode: string | undefined,
    code: string,
    passenger: {
        name: string,
        cpf: string,
        birthdate: Date
    },
    flight: {
        departureTime: Date,
        departureAirport: string,
        destinationAirport: string,
        class: FlightClassOptions,
        code: string
    }
}
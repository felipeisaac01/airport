import { FlightClassOptions } from "@prisma/client";
import { ParsedQs } from "qs";
import { FlightClassType } from "./flight";

export interface IPurchaseTicketDto {
    classType: FlightClassType;
    passengers: {
        cpf: string,
        birthdate: Date,
        name: string
        luggage: true
    }[]
}

export interface IPurchasedTicketDto {
    id: string;
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

export interface IGetTicketsForPurchaseParamsDto extends ParsedQs {
    departureAirportCode: string;
    destinationAirportCode: string;
    date: string | undefined;
    minValue: string | undefined;
    maxValue: string | undefined;
}

export interface IGetAvailableTicketsForPurchaseResponseDto {
    id: string;
    type: FlightClassOptions;
    value: number;
    quantity: number;
    flight: {
        code: string;
        departureTime: Date;
    };
}

export interface IEmitTicketResponseDto {
    flightCode: string;
    ticketCode: string;
    departureAirport: string;
    destinationAirport: string;
    passenger: {
        cpf: string;
        birthdate: Date;
        name: string;
    },
    luggage: boolean;
}
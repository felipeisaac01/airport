import { FlightClassOptions } from "@prisma/client";
import { ParsedQs } from "qs";
import { FlightClassType } from "./flight";

export interface IPurchaseTicketDto {
    classType: FlightClassType;
    passengers: {
        cpf: string,
        birthdate: Date,
        name: string
        luggage: boolean
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
    flight: {
        id: string
        code: string;
        departureTime: Date;
    };
    tickets: {
        id: string;
        type: FlightClassOptions;
        value: number;
        quantity: number;
    }[]
}

export interface IEmitTicketResponseDto {
    buyerId: string;
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

export interface IGetBuyersTicketsResponseDto {
    buyer: {
        name: string;
        email:string; 
        cpf: string;
        birthdate: Date;
        tickets: {
            passenger: {
                name: string;
                cpf: string;
                birthdate: Date;
            },
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
            id: string;
            luggage: {
                code: string;
            } | null;
            totalValue: number;
            code: string;
            canceled: boolean;
        }[]
    }
}

export interface ICancelPurchaseResponseDto {
    canceledTicket: {
        birthdate: Date;
        cpf: string;
        code: string;
        canceled: boolean;
        name: string;
        totalValue: number;
    }
}
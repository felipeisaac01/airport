import { FlightClassOptions } from "@prisma/client";

export interface ICreateClassDto {
    flightId: string;
    quantity: number;
    value: number;
    type: FlightClassOptions
}

export interface ICreateClassResponseDto {
    flightId: string;
    quantity: number;
    value: number;
    type: FlightClassOptions
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null
}

export interface IUpdateClassDto {
    id: string;
    quantity: number | undefined;
    value: number | undefined;
}

export interface IUpdateClassResponseDto {
    flightId: string;
    quantity: number;
    value: number;
    type: FlightClassOptions
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null
}
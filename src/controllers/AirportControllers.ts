import { Request, Response } from "express";
import { IGetAirportResponseDTO } from "../domain/dtos/controllers/airport";
import { repositories } from "../repositories";

export async function getAirports(_req: Request, res: Response<IGetAirportResponseDTO[]>) {
    const airports = await repositories.airport.getAll();

    res.send(airports.map(airport => {
        return {
            id: airport.id,
            createdAt: airport.createdAt,
            updatedAt: airport.updatedAt,
            iataCode: airport.iataCode,
            name: airport.name,
            city: airport.city.name,
            federativeUnit: airport.city.federativeUnit,
        }
    }));
}


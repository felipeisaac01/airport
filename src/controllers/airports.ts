import { Request, Response } from "express";
import { IGetAirportResponseDTO } from "../domain/dtos/controllers/airports";
import { airportRepository } from "../repositories";

export async function getAirports(_req: Request, res: Response<IGetAirportResponseDTO[]>) {
    const airports = await airportRepository.getAll();

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


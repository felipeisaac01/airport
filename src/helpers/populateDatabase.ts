import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./crypt";

export async function populateDatabase() {
    const prismaClient = new PrismaClient()
    
    const existingAirports = await prismaClient.airport.findMany()

    if (!existingAirports.length) {
        await prismaClient.city.createMany({
            data: [
                {
                    federativeUnit: "BA",
                    name: "Salvador",
                },
                {
                    federativeUnit: "MG",
                    name: "Belo Horizonte"
                },
                {
                    federativeUnit: "RJ",
                    name: "Rio de Janeiro"
                },
                {
                    federativeUnit: "RN",
                    name: "Natal"
                },
                {
                    federativeUnit: "RS",
                    name: "Porto Alegre"
                },
                {
                    federativeUnit: "SP",
                    name: "São Paulo"
                }
            ]
        })

        const cities = await prismaClient.city.findMany()

        const airportsToInsert: {
            cityId: string,
            iataCode: string,
            name: string
        }[] = [];

        for (const city of cities) {
            if (city.federativeUnit === "BA") {
                airportsToInsert.push({
                    cityId:  city.id,
                    iataCode: "SSA",
                    name: "Dois de Julho"
                })
            } else if (city.federativeUnit === "MG") {
                airportsToInsert.push({
                    cityId:  city.id,
                    iataCode: "BHZ",
                    name: "Confins"
                })
            } else if (city.federativeUnit === "RJ") {
                airportsToInsert.push({
                    cityId:  city.id,
                    iataCode: "GIG",
                    name: "Galeão"
                }, {
                    cityId:  city.id,
                    iataCode: "SDU",
                    name: "Santos Dummont"
                })
            } else if (city.federativeUnit === "SP") {
                airportsToInsert.push({
                    cityId:  city.id,
                    iataCode: "GRU",
                    name: "Guarulhos"
                }, {
                    cityId:  city.id,
                    iataCode: "CGH",
                    name: "Congonhas"
                })
            } else if (city.federativeUnit === "RN") {
                airportsToInsert.push({
                    cityId:  city.id,
                    iataCode: "NAT",
                    name: "Governador Aluízio Alves"
                })
            } else if (city.federativeUnit === "RS") {
                airportsToInsert.push({
                    cityId:  city.id,
                    iataCode: "POA",
                    name: "Salgado Filho"
                })
            }
        }

        await prismaClient.airport.createMany({
            data: airportsToInsert
        })

    }

    const admin = await prismaClient.user.findFirst({ where: { username: "originalAdmin" } })

    if (!admin) {
        await prismaClient.user.create({
            data: {
                password: await hashPassword("123456"),
                username: "originalAdmin",
                role: 'ADMIN'
            }
        })
    }

    const buyer = await prismaClient.user.findFirst({ where: { username: "originalBuyer" } });

    if (!buyer) {
        await prismaClient.user.create({
            data: {
                password: await hashPassword("123456"),
                username: "originalBuyer",
                role: 'BUYER'
            }
        })
    }
    
    prismaClient.$disconnect()
}
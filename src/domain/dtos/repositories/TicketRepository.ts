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
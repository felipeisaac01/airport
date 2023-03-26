export interface IGetByTicketIdDto {
    code: string;
    ticket: {
        name: string;
        code: string;
    };
}
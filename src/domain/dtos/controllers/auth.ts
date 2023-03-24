export interface ILoginRequestDto {
    username: string;
    password: string
}

export interface ILoginResponseDto {
    token: string;
}

export interface IAuthTokenDto {
    userId: string,
    userPermission: "ADMIN" | "BUYER"
    iat: number
}

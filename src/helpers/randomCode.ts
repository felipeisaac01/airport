export function generateRandomCode(length: number, type: "NUMERIC" | "ALPHANUMERIC") {
    const charset = type === "NUMERIC" ? '01234567890' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABC';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    return result;
}
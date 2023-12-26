export interface IDecodedToken {
    aud?: string,
    jti?: string,
    iat?: number,
    nbf?: number,
    exp?: number,
    sub?: string,
    scopes: [] | string[]
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    authToken?: string;
    refreshToken?: string;
}
export interface ILoginIn {
    email: string;
    password: string;
}

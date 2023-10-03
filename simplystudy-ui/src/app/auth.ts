export interface UserCredentials {
    username: string,
    password: string
}

export interface LoggedUser {
    id: number,
    token: string,
    username: string
}
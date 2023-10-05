export interface UserCredentials {
    username: string,
    password: string
}

export interface LoggedUser {
    id: number,
    token: string,
    username: string
}

export interface RegisterUserData {
    username: string,
    password: string,
    re_password: string,
    email: string
}
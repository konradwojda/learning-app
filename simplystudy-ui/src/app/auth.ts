export interface UserCredentials {
  username: string;
  password: string;
}

export interface LoggedUser {
  id: number;
  auth_token: string;
  username: string;
}

export interface RegisterUserData {
  username: string;
  password: string;
  re_password: string;
  email: string;
}

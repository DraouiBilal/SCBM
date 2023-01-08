import { User } from "../User";

export interface LoginRes {
    token: string;
    user: User
}

export interface UserRes {
    user: User
}
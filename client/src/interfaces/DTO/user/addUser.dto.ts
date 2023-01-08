import { UserStatus } from "../../User";

export interface AddUserDTO {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    status: UserStatus;
}
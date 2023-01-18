export interface User {
    deviceId:string;
    email:string;
    fullname:string;
    id:string;
    phone:string;
    image: string;
    badgeId: string;
    status: UserStatus;
}

export enum UserStatus {
    ADMIN = "ADMIN",
    USER = "USER",
}
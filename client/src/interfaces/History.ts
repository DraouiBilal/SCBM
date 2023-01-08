import { Device } from "./Device";
import { User } from "./User";

export interface History {
    id: string;
    user_id: string;
    device_id: string;
    timestamp: string;
    action: Action,
    device: Device,
    user: User
}

export enum Action {
    LOGIN_FACE_SUCCESS = "LOGIN_FACE_SUCCESS",
    LOGIN_FACE_FAILURE = "LOGIN_FACE_FAILURE",
    LOGIN_BADGE_SUCCESS = "LOGIN_BADGE_SUCCESS",
    LOGIN_BADGE_FAILURE = "LOGIN_BADGE_FAILURE",
}
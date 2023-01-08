import { User } from "./User";

export interface Device {
    id: string;
    name: string;
    users?: User[]; 
}
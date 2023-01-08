import { GetDeviceRes } from "../interfaces/res/device.res";
import api from "./api";

const BASE_DEVICE_API = `/devices`;

export const getDevice = () => {
    return api.get<GetDeviceRes>(`${BASE_DEVICE_API}/users`);
}

export const openDoor = () => {
    return api.post(`${BASE_DEVICE_API}/open`);
}
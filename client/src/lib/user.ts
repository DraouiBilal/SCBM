import { AddUserDTO } from "../interfaces/DTO/user/addUser.dto";
import { LoginDTO } from "../interfaces/DTO/user/login.dto";
import { UpdateUserDTO } from "../interfaces/DTO/user/updateUser.dto";
import { LoginRes, UserRes } from "../interfaces/res/user.res";
import api from "./api";

const BASE_USER_API = `/users`;

export const login = (body: LoginDTO) => {
    return api.post<LoginRes>(`${BASE_USER_API}/login`, body);
}

export const getUser = () => {
    return api.get<UserRes>(`${BASE_USER_API}/me`,);
}

export const addUser = (body: AddUserDTO) => {
    return api.post<UserRes>(`${BASE_USER_API}/signup`, body);
}

export const updateUser = (body: UpdateUserDTO) => {
    return api.patch<UserRes>(`${BASE_USER_API}/me`, body);
}

export const deleteUser = (id: string) => {
    return api.delete(`${BASE_USER_API}/${id}`);
}
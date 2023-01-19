import { AddUserDTO } from "../interfaces/DTO/user/addUser.dto";
import { LoginDTO } from "../interfaces/DTO/user/login.dto";
import { UpdateUserDTO } from "../interfaces/DTO/user/updateUser.dto";
import { LoginRes, UserRes } from "../interfaces/res/user.res";
import api from "./api";

const BASE_USER_API = `/users`;

export const login = (body: LoginDTO) => {
    return api.post<LoginRes>(`${BASE_USER_API}/login`, body);
}

export const  getUser = () => {
    const res = api.get<UserRes>(`${BASE_USER_API}/me`);
    console.log("test");
    return res;
}

export const addUser = (body: AddUserDTO) => {
    return api.post<UserRes>(`${BASE_USER_API}/signup`, body);
}

export const updateUser = (body: UpdateUserDTO,image: File | null | undefined ) => {
    const p1 =  api.patch<UserRes>(`${BASE_USER_API}/me`, body);
    const p2 =  api.patch<UserRes>(`${BASE_USER_API}/me/image`, image, {
        'Content-Type': 'multipart/form-data'
    });
    return Promise.all([p1, p2]);
}

export const deleteUser = (id: string) => {
    return api.delete(`${BASE_USER_API}/${id}`);
}
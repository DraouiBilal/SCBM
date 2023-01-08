export interface UpdateUserDTO {
    fullname: string;
    email: string;
    phone: string;
    image: string | null;
    password?: string;
}
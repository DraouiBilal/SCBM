import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notify } from "notiflix";
import { Dispatch, SetStateAction, useEffect } from "react";
import { getDevice } from "../../lib/device";
import { deleteUser } from "../../lib/user";

type props = {
    setLoading: Dispatch<SetStateAction<{
        isLoading: boolean;
        message: string;
    }>>
};

const UsersTable = ({ setLoading }: props) => {

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery(["device"], getDevice, {
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24,
    });

    const {mutate, isLoading: isDeleting} = useMutation(deleteUser, {
        onSuccess(data) {
            Notify.success("User removed successfully");
            queryClient.invalidateQueries(["device"]);
        },
        onError(error: unknown) {
            console.log(error);
            if (error instanceof Error)
                Notify.failure(error.message);
            Notify.failure("Something went wrong");
        }
    });

    useEffect(() => {
        setLoading({ isLoading: isDeleting || isLoading, message: "Loading ..." });
    }, [isLoading, isDeleting])

    return (
        <div className="w-full mt-6">
            <p className="text-xl pb-3 flex items-center">
            <svg className="w-6 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg> Registered Users
            </p>
            <div className="bg-white overflow-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {
                            !isLoading && data && data.device.users!.map(user => (

                                <tr key={user.id}>
                                    <td className="w-1/3 text-left py-3 px-4">{user.fullname}</td>
                                    <td className="w-1/3 text-left py-3 px-4">{user.email}</td>
                                    <td className="text-left py-3 px-4"><a className="hover:text-blue-500" href="tel:622322662">{user.phone}</a></td>
                                    <td className="text-left py-3 px-4">
                                        <a className="hover:text-blue-500">
                                            <span onClick={()=>mutate(user.id)} className="h-8 cursor-pointer w-8 flex justify-center items-center border border-gray-600 rounded-full "><svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg></span>
                                        </a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersTable
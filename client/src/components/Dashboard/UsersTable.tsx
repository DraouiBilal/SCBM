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
                <i className="fas fa-list mr-3"></i> Registered Users
            </p>
            <div className="bg-white overflow-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Image</th>
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
                                    <td className="text-left py-3 px-4"><a className="hover:text-blue-500" href="mailto:jonsmith@mail.com"><img className="h-32 w-32" src={user.image}/></a></td>
                                    <td className="text-left py-3 px-4 flex justify-center">
                                        <a className="hover:text-blue-500">
                                            <span onClick={()=>mutate(user.id)} className="h-8 cursor-pointer w-8 flex justify-center items-center border border-gray-600 rounded-full "><i className="transition-all hover:text-lg text-red-600 hover:text-red-900 fa fa-trash"></i></span>
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
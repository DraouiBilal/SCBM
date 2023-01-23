import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notify } from "notiflix";
import { Dispatch, SetStateAction, useEffect } from "react";
import { getHistory } from "../../lib/history";

type props = {
    setLoading: Dispatch<SetStateAction<{
        isLoading: boolean;
        message: string;
    }>>
};

const HistoriesTable = ({ setLoading }: props) => {

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery(["history"], getHistory, {
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24,
    });

//     const {mutate, isLoading} = useMutation(deleteUser, {
//         onSuccess(data) {
//             Notify.success("User removed successfully");
//             queryClient.invalidateQueries(["device"]);
//         },
//         onError(error: unknown) {
//             console.log(error);
//             if (error instanceof Error)
//                 Notify.failure(error.message);
//             Notify.failure("Something went wrong");
//         }
//     });>

    useEffect(() => {
        setLoading({ isLoading, message: "Loading History..." });
    }, [isLoading])

    return (
        <div className="w-full mt-6">
            <p className="text-xl pb-3 flex items-center">
            <svg className="w-6 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg> History
            </p>
            <div className="bg-white overflow-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Full Name</th>
                            <th className="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Method</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {
                            !isLoading && data && data.histories.map(history => (

                                <tr key={history.id}>
                                    <td className="w-1/3 text-left py-3 px-4">{history.user.fullname}</td>
                                    <td className="w-1/3 text-left py-3 px-4">{new Date(history.timestamp).toString()}</td>
                                    <td className="text-left py-3 px-4"><a className="hover:text-blue-500" href="tel:622322662">{history.action}</a></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HistoriesTable
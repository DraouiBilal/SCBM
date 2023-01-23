import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { Notify, Report } from "notiflix";
import { Dispatch, SetStateAction } from "react";
import { UserRes } from "../../interfaces/res/user.res";
import { UserStatus } from "../../interfaces/User";
import { openDoor } from "../../lib/device";

type props = {
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    setLoading: Dispatch<SetStateAction<{
        isLoading: boolean;
        message: string;
    }>>
}

const Sidebar = ({ setLoggedIn, setLoading }: props) => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const user: UserRes | undefined = queryClient.getQueryData(["user"]);

    const { mutate, isLoading } = useMutation(openDoor, {
        onSuccess(data) {
            Report.success("Opened", "Door opened successfully", "Close");
            queryClient.invalidateQueries(["history"]);
        },
        onError(error: unknown) {
            console.log(error);
            Report.failure("Failure", "Failed to open the door", "Close");
        },
        onSettled() {
            setLoading({
                isLoading: false,
                message: ""
            })
        }
    });

    const signout = () => {
        localStorage.removeItem("token");
        queryClient.invalidateQueries(["user"]);
        Notify.success('Logged out successfully');
        setLoggedIn(false);
        router.push("/login");
    }

    const openDoorHandler = async () => {
        setLoading({
            isLoading: true,
            message: "Opening the door..."
        })
        mutate();
    }

    return (
        <>
            <aside className="relative bg-sidebar h-screen w-64 hidden sm:block shadow-xl">
                <div className="p-6">
                    <a href="index.html" className="text-white text-3xl font-semibold uppercase hover:text-gray-300">{user && (user.user.status === UserStatus.ADMIN ? "Admin" : "User")}</a>
                    <button onClick={openDoorHandler} className="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
                        Open the Door
                    </button>
                </div>
                <nav className="text-white text-base font-semibold pt-3">
                    {user && user.user.status==="ADMIN" && <Link href="/" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                        <svg className="mr-3 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>
                        Dashboard
                    </Link>}
                    <Link href="/account" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                    <svg className="mr-3 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272 304h-96C78.8 304 0 382.8 0 480c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32C448 382.8 369.2 304 272 304zM48.99 464C56.89 400.9 110.8 352 176 352h96c65.16 0 119.1 48.95 127 112H48.99zM224 256c70.69 0 128-57.31 128-128c0-70.69-57.31-128-128-128S96 57.31 96 128C96 198.7 153.3 256 224 256zM224 48c44.11 0 80 35.89 80 80c0 44.11-35.89 80-80 80S144 172.1 144 128C144 83.89 179.9 48 224 48z"/></svg>
                        My Account
                    </Link>
                    <Link href="/history" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                    <svg className="mr-3 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z"/></svg>
                        History
                    </Link>
                    <Link onClick={signout} href="" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                    <svg className="mr-3 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"/></svg>
                        Sign Out
                    </Link>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
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
                    <Link href="/" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                        <i className="fas fa-tachometer-alt mr-3"></i>
                        Dashboard
                    </Link>
                    <Link href="/account" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                        <i className="fas fa-user mr-3"></i>
                        My Account
                    </Link>
                    <Link href="/history" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                        <i className="fas fa-user mr-3"></i>
                        History
                    </Link>
                    <Link onClick={signout} href="" className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        Sign Out
                    </Link>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
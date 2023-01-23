import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link"
import { Report } from "notiflix"
import { Dispatch, SetStateAction, useState } from "react"
import { openDoor } from "../../lib/device"

type props = {
    setLoading: Dispatch<SetStateAction<{
        isLoading: boolean;
        message: string;
    }>>
};

const MobileHeader = ({ setLoading }: props) => {

    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();

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

    const openDoorHandler = async () => {
        mutate();
    }

    return (
        <header className="w-full bg-sidebar py-5 px-6 sm:hidden">
            <div className="flex items-center justify-between">
                <Link href="index.html" className="text-white text-3xl font-semibold uppercase hover:text-gray-300">Admin</Link>
                <button onClick={openDoorHandler} className="w-50 bg-white cta-btn font-semibold p-2 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
                    Open the Door
                </button>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl focus:outline-none">
                <svg className="mr-3 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                </button>
            </div>

            <nav className={`${isOpen ? "flex" : "hidden"} flex-col pt-4`}>
                <Link href="/" className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item">
                    <i className="fas fa-tachometer-alt mr-3"></i>
                    Dashboard
                </Link>
                <Link href="/account" className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item">
                    <i className="fas fa-user mr-3"></i>
                    My Account
                </Link>
                <Link href="/account" className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item">
                    <i className="fas fa-user mr-3"></i>
                    History
                </Link>
                <Link href="" className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item">
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Sign Out
                </Link>
            </nav>
        </header >
    )

}

export default MobileHeader
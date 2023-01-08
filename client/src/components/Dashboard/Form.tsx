import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notify } from "notiflix";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef } from "react";
import { AddUserDTO } from "../../interfaces/DTO/user/addUser.dto";
import { UserStatus } from "../../interfaces/User";
import { addUser } from "../../lib/user";

type props = {
    setLoading: Dispatch<SetStateAction<{
        isLoading: boolean;
        message: string;
    }>>
}

const Form = ({ setLoading }: props) => {

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation(addUser, {
        onSuccess(data) {
            Notify.success("User added successfully");
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
        setLoading({ isLoading, message: "Loading ..." });
    }, [isLoading])

    const fullnameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fullnameRef.current || !emailRef.current || !phoneRef.current) return;
        const fullname = fullnameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        const user: AddUserDTO = { fullname, email, phone, status: UserStatus.USER, password: "Abc@12345" };
        mutate(user);
    }

    return (

        <div className="w-full mt-6 pl-0 lg:pl-2">
            <p className="text-xl pb-3 flex items-center">
                <i className="fas fa-list mr-3"></i> Register a user
            </p>
            <div className="leading-loose w-full flex justify-center">
                <form className="p-10 bg-white rounded shadow-xl" onSubmit={(e) => onSubmit(e)}>
                    <p className="text-lg text-gray-800 font-medium pb-4">Customer information</p>
                    <div className="">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Full Name</label>
                        <input ref={fullnameRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="cus_name" name="cus_name" type="text" required placeholder="Full Name" aria-label="Name" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Email</label>
                        <input ref={emailRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="cus_name" name="cus_name" type="text" required placeholder="Email" aria-label="Name" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Phone (format: +xxx xxx-xx-xx-xxx)</label>
                        <input ref={phoneRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="cus_name" name="cus_name" type="text" required placeholder="Phone" aria-label="Name" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Image</label>
                        <input className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="cus_name" name="cus_name" type="file" placeholder="Your Name" aria-label="Name" />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Form
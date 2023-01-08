import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notify } from "notiflix";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef } from "react";
import { UpdateUserDTO } from "../../interfaces/DTO/user/updateUser.dto";
import { UserRes } from "../../interfaces/res/user.res";
import { updateUser } from "../../lib/user";

type props = {
    setLoading: Dispatch<SetStateAction<{
        isLoading: boolean;
        message: string;
    }>>
}

const AccountForm = ({ setLoading }: props) => {

    const queryClient = useQueryClient();

    const userRes: UserRes | undefined = queryClient.getQueryData(["user"]);
    const user = userRes?.user;

    const { mutate, isLoading } = useMutation(updateUser, {
        onSuccess(data) {
            Notify.success("Account updated successfully");
            passwordRef.current!.value = "";
            confirmPasswordRef.current!.value = "";
            queryClient.invalidateQueries(["user"]);
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
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fullnameRef.current || !emailRef.current || !phoneRef.current || !passwordRef.current || !confirmPasswordRef.current ) return;
        const fullname = fullnameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (password !== confirmPassword) {
            Notify.failure("Passwords do not match");
            return;
        }

        const user: UpdateUserDTO = { fullname, email, phone, password };
        mutate(user);
    }

    return (

        <div className="w-full mt-6 pl-0 lg:pl-2">
            <p className="text-xl pb-3 flex items-center">
                <i className="fas fa-list mr-3"></i> Update your account
            </p>
            <div className="leading-loose w-full flex justify-center">
                <form className="p-10 bg-white rounded shadow-xl" onSubmit={(e) => onSubmit(e)}>
                    <p className="text-lg text-gray-800 font-medium pb-4">Customer information</p>
                    <div className="">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Full Name</label>
                        <input defaultValue={user?.fullname} ref={fullnameRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" type="text" required placeholder="Full Name" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Email</label>
                        <input defaultValue={user?.email} ref={emailRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" type="text" required placeholder="Email" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Phone (format: +xxx xxx-xx-xx-xxx)</label>
                        <input defaultValue={user?.phone} ref={phoneRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" type="text" required placeholder="Phone" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Password</label>
                        <input ref={passwordRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" type="password" required placeholder="Password" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Confirm Password</label>
                        <input ref={confirmPasswordRef} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" type="password" required placeholder="Confirm Password" />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm text-gray-600" htmlFor="cus_name">Image</label>
                        <input className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" type="file" placeholder="Your Name" />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default AccountForm
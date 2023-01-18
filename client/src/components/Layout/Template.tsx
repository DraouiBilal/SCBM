import { useQuery } from "@tanstack/react-query";
import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUser } from "../../lib/user";
import Header from "./Header";
import Loading from "./Loading";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

type props = {
    Component: NextComponentType<NextPageContext, any, any>,
    pageProps: any
}

const Template = ({ Component, pageProps }: props) => {

    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState({
        isLoading: false,
        message: ""
    });

    const { isLoading,data } = useQuery(["user"], getUser, {
        staleTime: 1000 * 60 * 60 * 24 * 7,
        cacheTime: 1000 * 60 * 60 * 24 * 7,
        onSuccess(data) {
            setLoggedIn(true);
        },
        onError(error) {
            router.push("/login");
            setLoggedIn(false);
        }
    });

    useEffect(() => {
        console.log("isLoading: ", isLoading);
        console.log("data: ", data);
        
        setLoading({
            isLoading,
            message: "Loading ..."
        })

    }, [isLoading])

    if (isLoading || (!isLoading && !loggedIn)) {
        return <Component {...pageProps} setLoading={setLoading} />
    }

    if (loggedIn)
        return (
            <div className="bg-gray-100 font-family-karla flex">
                <Sidebar setLoading={setLoading} setLoggedIn={setLoggedIn} />
                <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
                    <Header />
                    <MobileHeader setLoading={setLoading} />
                    <Loading loading={loading} />
                    <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
                        <main className="w-full flex-grow p-6">
                            <Component {...pageProps} setLoading={setLoading} />
                        </main>
                    </div>
                </div>
            </div>
        );

    return <Component {...pageProps} setLoading={setLoading} />

};

export default Template;
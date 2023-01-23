import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type AppType } from "next/dist/shared/lib/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "../styles/globals.css";
import React from "react";
import Template from "../components/Layout/Template";

const MyApp: AppType = ({ Component, pageProps }) => {

  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Template Component={Component} pageProps={pageProps}/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>);
};

export default MyApp;
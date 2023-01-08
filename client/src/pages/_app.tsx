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
      <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js" integrity="sha256-KzZiKy0DWYsnwMF+X1DvQngQ2/FxF7MF3Ff72XcpuPs=" crossOrigin="anonymous"></script>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>);
};

export default MyApp;
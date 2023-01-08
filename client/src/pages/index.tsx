import { type NextPage } from "next";
import Head from "next/head";
import { Dispatch, SetStateAction, useState } from "react";
import Form from "../components/Dashboard/Form";
import UsersTable from "../components/Dashboard/UsersTable";

type props = {
  setLoading: Dispatch<SetStateAction<{
    isLoading: boolean;
    message: string;
  }>>
};

export const getStaticProps = () => {
  return {
    props: {}
  }
}

const Home: NextPage = ({ setLoading }: props) => {

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl text-black pb-6">Dashboard</h1>
      <Form setLoading={setLoading} />
      <UsersTable setLoading={setLoading} />
    </>
  );
};

export default Home;

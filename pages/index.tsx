import type { NextPage } from "next";
import { Main } from "../components/Main/Main";
import Head from "next/head";
import { Footer } from "../components/Footer/Footer";
import { Hero } from "../components/Hero/Hero";
import { Nabar } from "../components/Navbar/Nabar";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import { Dashboard } from "../components/Dashboard/Dashboard";

const Home: NextPage = () => {
  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex ">
        <Sidebar />
        {/* <Main /> */}
        <Dashboard />
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

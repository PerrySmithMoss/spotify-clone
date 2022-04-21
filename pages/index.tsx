import type { NextPage } from "next";
import { Main } from "../components/Main/Main";
import Head from "next/head";
import { Player } from "../components/Player/Player";
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
        <Dashboard />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
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

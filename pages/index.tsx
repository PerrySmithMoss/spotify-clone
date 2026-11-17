import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { Player } from "../components/Player/Player";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { authOptions } from "../lib/auth";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.error)
    return { redirect: { destination: "/auth/login", permanent: false } };

  return {
    props: {
      session,
    },
  };
};

import type { NextPage } from "next";
import Head from "next/head";
import { Main } from "../../components/Main/Main";
import { Player } from "../../components/Player/Player";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useAppStore } from "../../store/AppStore";

const IndividualPlaylist: NextPage = () => {
  const { selectedPlaylist } = useAppStore();

  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>{selectedPlaylist && selectedPlaylist?.name} | Spotify</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        <Main />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualPlaylist;

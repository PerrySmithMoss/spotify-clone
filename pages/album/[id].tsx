import type { NextPage } from "next";
import Head from "next/head";
import { Album } from "../../components/Main/Album/Album";
import { Player } from "../../components/Player/Player";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useAppStore } from "../../store/AppStore";

const IndividualAlbum: NextPage = () => {
  const { selectedAlbum } = useAppStore();
  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify - {selectedAlbum && selectedAlbum?.name}</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        <Album />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualAlbum;

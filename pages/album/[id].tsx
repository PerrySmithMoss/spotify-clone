import type { NextPage } from "next";
import Head from "next/head";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useAppStore } from "../../store/AppStore";
import { Player } from "../../components/Player/Player";
import { Album } from "../../components/Main/Album/Album";

const IndividualAlbum: NextPage = () => {
  const { selectedAlbumId, selectedAlbum } = useAppStore();
  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify - {selectedAlbum && selectedAlbum?.name}</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        {selectedAlbumId && selectedAlbumId !== undefined && <Album />}
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualAlbum;

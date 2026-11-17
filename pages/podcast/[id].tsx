import type { NextPage } from "next";
import Head from "next/head";
import { Podcast } from "../../components/Main/Podcast/Podcast";
import { Player } from "../../components/Player/Player";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useAppStore } from "../../store/AppStore";

const IndividualPodcast: NextPage = () => {
  const { selectedPodcast } = useAppStore();

  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify - {selectedPodcast && selectedPodcast?.name}</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        <Podcast />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualPodcast;

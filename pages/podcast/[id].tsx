import type { NextPage } from "next";
import Head from "next/head";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useAppStore } from "../../store/AppStore";
import { Player } from "../../components/Player/Player";
import { Podcast } from "../../components/Main/Podcast/Podcast";

const IndividualPodcast: NextPage = () => {
  const { selectedPodcastId, selectedPodcast } = useAppStore();

  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify - {selectedPodcast && selectedPodcast?.name}</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        {selectedPodcastId && selectedPodcastId !== undefined && <Podcast />}
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualPodcast;

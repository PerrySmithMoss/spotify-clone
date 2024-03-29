import type { NextPage } from "next";
import Head from "next/head";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Player } from "../../components/Player/Player";
import { PlaylistCollection } from "../../components/Main/Collection/PlaylistCollection";
import { PodcastCollection } from "../../components/Main/Collection/PodcastCollection";
import { AlbumCollection } from "../../components/Main/Collection/AlbumCollections";
import { ArtistCollection } from "../../components/Main/Collection/ArtistCollection";
import { useRouter } from "next/router";
import { TrackCollection } from "../../components/Main/Collection/TrackCollection";

const IndividualCollection: NextPage = () => {
  const router = useRouter();

  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify - Your Library</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        {router.asPath === "/collections/podcasts" ? (
          <PodcastCollection />
        ) : router.asPath === "/collections/artists" ? (
          <ArtistCollection />
        ) : router.asPath === "/collections/albums" ? (
          <AlbumCollection />
        ) : router.asPath === "/collections/tracks" ? (
          <TrackCollection />
        ) : (
          <PlaylistCollection />
        )}
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualCollection;

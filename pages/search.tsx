import type { NextPage } from "next";
import { Main } from "../components/Main/Main";
import Head from "next/head";
import { Player } from "../components/Player/Player";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { getSession } from "next-auth/react";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { useAppStore } from "../store/AppStore";
import { SearchContainer } from "../components/Search/SearchContainer";

const Search: NextPage = () => {
  const { selectedPlaylistId } = useAppStore();
  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>Spotify - Search</title>
        <meta name="description" content="Search Spotify to find the music you love." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex ">
        <Sidebar />
        <SearchContainer />

      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Search;
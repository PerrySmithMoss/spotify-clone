import type { NextPage } from "next";
import Head from "next/head";
import { Player } from "../components/Player/Player";
import { SearchContainer } from "../components/Search/SearchContainer";
import { Sidebar } from "../components/Sidebar/Sidebar";

const Search: NextPage = () => {
  return (
    <div className="bg-spotify-gray h-screen overflow-hidden ">
      <Head>
        <title>Spotify - Search</title>
        <meta
          name="description"
          content="Search Spotify to find the music you love."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
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

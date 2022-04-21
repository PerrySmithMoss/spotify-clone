import type { NextPage } from "next";
import { Main } from "../../components/Main/Main";
import Head from "next/head";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useAppStore } from "../../store/AppStore";
import { useEffect } from "react";
import { Player } from "../../components/Player/Player";
import { useSpotify } from "../../hooks/useSpotify";

const IndividualPlaylist: NextPage = () => {
  const { selectedPlaylist, setSelectedPlaylist, selectedPlaylistId } =
    useAppStore();
    const spotifyAPI = useSpotify();

  useEffect(() => {
    if (typeof selectedPlaylistId === "string") {
      spotifyAPI
        .getPlaylist(selectedPlaylistId)
        .then((data) => {
          setSelectedPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedPlaylistId]);

  return (
    <div className="bg-spotify-black h-screen overflow-hidden">
      <Head>
        <title>{selectedPlaylist && selectedPlaylist?.name} | Spotify</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <Sidebar />
        {selectedPlaylistId && selectedPlaylistId !== undefined && <Main />}
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default IndividualPlaylist;

// export const getServerSideProps = async (context: any) => {
//   const { id } = context.query;
//   let playlist;

//   if (typeof id === "string") {
//     spotifyAPI
//       .getPlaylist(id)
//       .then((data) => {
//         playlist = data.body;
//       })
//       .catch((err) => console.log("Something went wrong: ", err));
//   }

//   return {
//     props: {
//       session: "Yo",
//     },
//   };
// };

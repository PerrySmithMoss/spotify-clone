import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { colours } from "../../constants/colors";
import { shuffleArrayOfStrings } from "../../utils/shuffleArray";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import dashboardStyles from "./dashboard.module.css";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = ({}) => {
  const { data: session } = useSession();
  const [colour, setColour] = useState<any>(null);
  const spotifyAPI = useSpotify();
  const { userPlaylists, setUserPlaylists } = useAppStore();
  const [usersTopArtists, setUsersTopArtists] = useState<object[]>([]);
  const [usersTopSongs, setUsersTopSongs] = useState<object[]>([]);
  const [usersSavedShows, setUsersSavedShows] = useState<object[]>([]);
  const { selectedPlaylistId } = useAppStore();

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      spotifyAPI.getMyTopArtists().then((data) => {
        setUsersTopArtists(data.body.items);
      });
    }
  }, [spotifyAPI]);

  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      spotifyAPI.getMyTopTracks().then((data) => {
        setUsersTopSongs(data.body.items);
      });
    }
  }, [spotifyAPI]);

  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      spotifyAPI.getMySavedShows().then((data) => {
        setUsersSavedShows(data.body.items);
      });
    }
  }, [spotifyAPI]);

  return (
    <div className="flex-grow bg-spotify-gray  h-screen overflow-y-scroll scrollbar-hide select-none relative">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex items-center  bg-spotify-gray space-x-2 opacity-90 hover:opacity-80 cursor-pointer rounded-full pr-2"
        >
          <img
            className="rounded-full w-9 h-9 p-1"
            src={session?.user?.image}
            alt="Users Profile Picture"
          />
          <h2 className="truncate w-32 text-white">{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>
      <section
        className={`px-10 bg-gradient-to-b to-spotify-gray ${colour}  h-40 text-white pb-5 border-spotify-black `}
      >
        <h1 className="mt-24 text-white text-xl md:text-2xl lg:text-3xl font-bold">
          Good afternoon
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
          {userPlaylists.map((playlist: any) => (
            <div
              key={playlist.id}
              className={`${dashboardStyles.card} rounded`}
            >
              <div className="flex content-center items-center w-full">
                <div className="h-24 w-28 pr-4">
                  <img
                    className="h-full w-full rounded-l"
                    src={playlist.images[0].url}
                    alt={playlist.name}
                  />
                </div>
                <div className="truncate">
                  <p className="truncate">{playlist.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-between items-center content-center">
          <div>
            <h1 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Your top artists
            </h1>
          </div>
          <div>
            <button className="uppercase text-[#b3b3b3] text-xs tracking-wider font-bold">
              See All
            </button>
          </div>
        </div>
        <div
          className={`mt-8 grid grid-flow-col auto-cols-max auto-rows-max gap-8 overflow-y-hidden scrollbar-hide`}
        >
          {usersTopArtists.map((artist: any) => (
            <div key={artist.id}>
              <div>
                <img
                  className="rounded-sm h-52 w-52 "
                  src={artist.images[0].url}
                  alt={artist.name}
                />
              </div>
              <div className="w-40 mt-1.5">
                <p className="truncate">{artist.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-between items-center content-center">
          <div>
            <h1 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Your top tracks
            </h1>
          </div>
          <div>
            <button className="uppercase text-[#b3b3b3] text-xs tracking-wider font-bold">
              See All
            </button>
          </div>
        </div>
        <div
          className={`mt-8 grid grid-flow-col auto-cols-max auto-rows-max gap-8 overflow-y-hidden scrollbar-hide`}
        >
          {usersTopSongs.map((song: any) => (
            <div key={song.id}>
              <div>
                <img
                  className="rounded-sm h-52 w-52 "
                  src={song.album.images[0].url}
                  alt={song.name}
                />
              </div>
              <div className="w-40 mt-1.5">
                <p className="truncate">{song.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-between items-center content-center">
          <div>
            <h1 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Your top shows
            </h1>
          </div>
          <div>
            <button className="uppercase text-[#b3b3b3] text-xs tracking-wider font-bold">
              See All
            </button>
          </div>
        </div>
        <div
          className={`mt-8 pb-12 grid grid-flow-col auto-cols-max auto-rows-max gap-8 overflow-y-hidden scrollbar-hide`}
        >
          {usersSavedShows.map((show: any) => (
            <div key={show.show.id}>
              <div>
                <img
                  className="rounded-sm h-52 w-52 "
                  src={show.show.images[0].url}
                  alt={show.show.name}
                />
              </div>
              <div className="w-40 mt-1.5">
                <p className="truncate">{show.show.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

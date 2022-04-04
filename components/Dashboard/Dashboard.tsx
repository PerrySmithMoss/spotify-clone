import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { colours } from "../../constants/colors";
import { shuffleArrayOfStrings } from "../../utils/shuffleArray";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import Link from "next/link";
import dashboardStyles from "./dashboard.module.css";
import { useRouter } from "next/router";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = ({}) => {
  const { data: session } = useSession();
  const [colour, setColour] = useState<any>(null);
  const router = useRouter();
  const spotifyAPI = useSpotify();
  const { userPlaylists, setUserPlaylists } = useAppStore();
  const [usersTopArtists, setUsersTopArtists] = useState<object[]>([]);
  const [usersTopSongs, setUsersTopSongs] = useState<object[]>([]);
  const [usersSavedShows, setUsersSavedShows] = useState<object[]>([]);
  const {
    selectedPlaylistId,
    setSelectedPlaylistId,
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
  } = useAppStore();

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
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${dashboardStyles.iconLeft} cursor-not-allowed`
                : `${dashboardStyles.iconLeft}`
            }
          >
            <svg
              fill="#fff"
              role="img"
              height={22}
              width={22}
              viewBox="0 0 24 24"
            >
              <path d="M15.957 2.793a1 1 0 010 1.414L8.164 12l7.793 7.793a1 1 0 11-1.414 1.414L5.336 12l9.207-9.207a1 1 0 011.414 0z"></path>
            </svg>
          </button>
        </div>
        <div
          onClick={() => setIsProfileDrodownOpen(!isProfileDrodownOpen)}
          className="flex items-center bg-[#282828] space-x-3  py-1 pl-1  cursor-pointer rounded-full pr-2"
        >
          <img
            className="rounded-full w-8 h-8 text-white"
            src={session?.user?.image}
            // alt="Users Profile Picture"
          />
          <h2 className="truncate w-32 text-white text-sm font-bold">
            {session?.user?.name}
          </h2>
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>

      {isProfileDrodownOpen && (
        <div
          className={`h-12 w-52 rounded bg-[#282828] text-white absolute right-8 top-[4.3rem] px-1 flex`}
        >
          <div
            className="flex hover:bg-[#2b2d30] items-center justify-between cursor-pointer px-3 w-full"
            onClick={() => signOut()}
          >
            <p className="hover:bg-[#2b2d30] text-sm font-light">Log out</p>
          </div>
        </div>
      )}
      <section
        className={`px-10 bg-gradient-to-b to-spotify-gray ${colour}  h-40 text-white border-spotify-black `}
      >
        <h1 className="mt-10 text-white text-xl md:text-2xl lg:text-3xl font-bold">
          Good afternoon
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
          {userPlaylists.map((playlist: any) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
              <div
                // onClick={() => setSelectedPlaylistId(playlist.id)}
                key={playlist.id}
                className={`bg-[#282828] rounded cursor-pointer hover:bg-[#2b2d30]`}
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
            </Link>
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
          className={`mt-8 pb-28 grid grid-flow-col auto-cols-max auto-rows-max gap-8 overflow-y-hidden scrollbar-hide`}
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

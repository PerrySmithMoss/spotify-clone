import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { colours } from "../../../constants/colors";
import { useSpotify } from "../../../hooks/useSpotify";
import {
  milliSecondsToHours,
  milliSecondsToMinutesAndSeconds,
} from "../../../utils/time";
import { useAppStore } from "../../../store/AppStore";
import { shuffleArrayOfStrings } from "../../../utils/shuffleArray";
import { Songs } from "../../Song/Songs";
import { ClockIcon } from "@heroicons/react/outline";
import collectionStyles from "./collection.module.css";
import { useRouter } from "next/router";

interface TrackCollectionProps {}

export const TrackCollection: React.FC<TrackCollectionProps> = ({}) => {
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const [colour, setColour] = useState<any>(null);
  const [usersTopTracks, setUsersTopTracks] = useState<any[]>([]);
  const spotifyApi = useSpotify();
  const {
    libraryCollectionSelected,
    selectedPlaylistId,
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
    setCurrentTrackId,
    setIsPlaying,
  } = useAppStore();

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (libraryCollectionSelected === "tracks") {
      spotifyAPI
        .getMyTopTracks()
        .then((data) => {
          setUsersTopTracks(data.body.items);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, libraryCollectionSelected]);

  const playSong = (id: string, uri: string) => {
    // console.log(song)
    setCurrentTrackId(id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [uri],
    });
  };

  return (
    <div className="flex-grow h-screen bg-[#121212] overflow-y-scroll scrollbar-hide select-none relative">
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${collectionStyles.iconLeft} cursor-not-allowed`
                : `${collectionStyles.iconLeft}`
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
            alt="Users Profile Picture"
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
      {usersTopTracks && (
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-spotify-gray ${colour} h-[290px] text-white pl-7 pb-5`}
        >
          <img
            className="w-56 h-56 shadow-2xl"
            src="/assets/images/liked-songs.png"
            alt="Liked Songs"
          />
          <div>
            <p className="uppercase text-xs font-medium tracking-wide">
              Playlist
            </p>
            <h1 className="mt-4 text-2xl md:text-4xl lg:text-7xl font-bold">
              Liked Songs
            </h1>
            <div className="flex content-center items-center text-sm space-x-1 mt-5">
              <div>
                <img
                  className="rounded-full w-6 h-6 mr-1 text-white"
                  src={session?.user?.image}
                  alt="Users Profile Picture"
                />
              </div>
              <div>
                <p className="font-medium tracking-wide">
                  {session?.user.name}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="px-5">
        <div
          className={`${collectionStyles.grid} grid grid-cols-2 uppercase tracking-wider text-xs font-medium px-2  text-[#929292] hover:text-white rounded-md mt-5`}
        >
          <div className="flex items-center pl-3 space-x-5 py-1 w-full">
            <p className="text-[16px]">#</p>
            <p>Title</p>
          </div>
          <div className="flex items-center justify-between ml-auto md:ml-0 pr-10">
            <div>Album</div>
            {/* <div>Date Added</div> */}
            <ClockIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div>
        <div className="px-7 flex bg-[#121212] flex-col mt-3 space-y-2 pb-28 text-white">
          {usersTopTracks?.map((song: any, i: number) => (
            <div
              key={i}
              onClick={() => playSong(song.id, song.uri)}
              className={`${collectionStyles.searchSongIndividual} group grid grid-cols-2 text-[#b3b3b3] hover:text-white  hover:bg-[#282828] rounded-md mt-1 cursor-pointer`}
            >
              <div className="flex items-center pl-3 space-x-4 py-1 w-full">
                <p>{i + 1}</p>
                <div className="relative">
                  <img
                    className="h-auto w-10 group-hover:opacity-30"
                    src={song?.album?.images[0]?.url}
                    alt={song?.album?.name}
                  />
                  <div className={`${collectionStyles.searchPlayButtton} `}>
                    <svg
                      height={22}
                      width={22}
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <polygon
                        fill="white"
                        points="21.57 12 5.98 3 5.98 21 21.57 12"
                      ></polygon>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="w-36 lg:w-[20rem] truncate text-white">
                    {song.name}
                  </p>
                  <p className="w-40 text-sm">{song.artists[0].name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between ml-auto text-sm md:ml-0 pr-10">
                <p className="hidden md:inline w-40 lg:w-96 truncate">
                  {song.album.name}
                </p>
                <p>
                  {milliSecondsToMinutesAndSeconds(song?.duration_ms)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

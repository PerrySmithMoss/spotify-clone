import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { colours } from "../../constants/colors";
import { useSpotify } from "../../hooks/useSpotify";
import {
  milliSecondsToHours,
  milliSecondsToMinutesAndSeconds,
} from "../../lib/time";
import { useAppStore } from "../../store/AppStore";
import { shuffleArrayOfStrings } from "../../utils/shuffleArray";
import { Songs } from "../Song/Songs";
import { ClockIcon } from "@heroicons/react/outline";
import mainStyles from "./main.module.css";

interface MainProps {}

export const Main: React.FC<MainProps> = ({}) => {
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const [colour, setColour] = useState<any>(null);
  const {
    setSelectedPlaylistId,
    selectedPlaylistId,
    selectedPlaylist,
    setSelectedPlaylist,
  } = useAppStore();

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (typeof selectedPlaylistId === "string") {
      spotifyAPI
        .getPlaylist(selectedPlaylistId as string)
        .then((data) => {
          setSelectedPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedPlaylistId]);

  return (
    <div className="flex-grow h-screen  overflow-y-scroll scrollbar-hide select-none relative">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex items-center bg-spotify-gray space-x-3 opacity-90 py-1 hover:opacity-80 cursor-pointer rounded-full pr-2"
        >
          <img
            className="rounded-full w-8 h-8"
            src={session?.user?.image}
            alt="Users Profile Picture"
          />
          <h2 className="truncate w-32 text-white text-sm font-bold">
            {session?.user?.name}
          </h2>
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>
      {selectedPlaylist && (
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-spotify-gray ${colour} h-[340px] text-white pl-7 pb-5`}
        >
          <img
            className="w-56 h-56 shadow-2xl"
            src={selectedPlaylist?.images[0]?.url}
            alt="Playlist picture"
          />
          <div>
            <p className="uppercase text-xs font-medium tracking-wide">
              Playlist
            </p>
            <h1 className="mt-4 text-2xl md:text-4xl lg:text-7xl font-bold">
              {selectedPlaylist?.name}
            </h1>
            <div className="flex content-center items-center text-sm space-x-1 mt-5">
              <div>
                <p className="font-medium tracking-wide">
                  {session?.user.name}
                </p>
              </div>
              <div>•</div>
              <div>
                <span className="font-light">
                  {selectedPlaylist?.followers.total} likes
                </span>
              </div>
              <div>•</div>
              <div>
                <span className="font-light">
                  {selectedPlaylist?.tracks.total} songs,
                </span>
              </div>
              <div>
                <span className=" font-medium text-gray-500">
                  about{" "}
                  {milliSecondsToHours(
                    selectedPlaylist.tracks.items.reduce(
                      (acc: any, currentSong: any) =>
                        acc + currentSong.track.duration_ms,
                      0
                    )
                  )}{" "}
                  hr
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="px-5">
        <div
          className={`${mainStyles.grid} grid grid-cols-2 uppercase tracking-wider text-xs font-medium px-2  text-[#929292] hover:text-white rounded-md mt-5`}
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
        <Songs />
      </div>
    </div>
  );
};

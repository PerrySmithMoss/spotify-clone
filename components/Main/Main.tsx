import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import { shuffleArrayOfStrings } from "../../utils/shuffleArray";
import { Songs } from "./Song/Songs";

interface MainProps {}

const colours = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-orange-500",
];

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

  console.log("Selected playlist", selectedPlaylist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide select-none relative">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex items-center bg-spotify-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full pr-2"
        >
          <img
            className="rounded-full w-8 h-8 p-1"
            src={session?.user?.image}
            alt="Users Profile Picture"
          />
          <h2 className="truncate w-32 text-white">{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${colour} h-80 text-white pl-5 pb-5 border-spotify-black border-[.5px]`}
      >
        <img
          className="w-56 h-56 shadow-2xl"
          src={selectedPlaylist?.images[0]?.url}
          alt="Playlist picture"
        />
        <div>
          <p className="uppercase text-xs">Playlist</p>
          <h1 className="mt-4 text-2xl tablet:text-4xl desktop:text-7xl font-bold">
            {selectedPlaylist?.name}
          </h1>
          <div className="flex content-center items-center text-sm space-x-1 mt-5">
            <div>
              <p className="font-bold tracking-wide">Perry Smith-Moss</p>
            </div>
            <div>
            •
            </div>
            <div><span className="font-light">1 like</span></div>
            <div>
            •
            </div>
            <div><span className="font-light">61 songs,</span></div>
            <div>
              <span className=" font-medium text-gray-500">4 hr 5 min</span>
            </div>
          </div>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};
import React, { useEffect, useState } from "react";
import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  LogoutIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { useAppStore } from "../../store/AppStore";
import { useSpotify } from "../../hooks/useSpotify";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  const spotifyAPI = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<any>([]);
  const [song, setSong] = useState<any>();
  const { setSelectedPlaylistId, selectedPlaylistId } = useAppStore();

  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      spotifyAPI.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyAPI]);

  return (
    <aside>
   <div className="text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide smallTablet:max-w-[12rem] laptop:max-w-[15rem] hidden tablet:inline-flex ">
        <div className="space-y-4">
          <button className="flex items-center space-x-2 hover:text-white">
            <HomeIcon className="h-5 w-5" />
            <p>Home</p>
          </button>

          <button className="flex items-center space-x-2 hover:text-white">
            <SearchIcon className="h-5 w-5" />
            <p>Search</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <LibraryIcon className="h-5 w-5" />
            <p>Your Library</p>
          </button>
          <hr className="border-t-[0.1px]  border-gray-900" />

          <button className="flex items-center space-x-2 hover:text-white">
            <PlusCircleIcon className="h-5 w-5" />
            <p>Create Playlist</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <HeartIcon className="h-5 w-5" />
            <p>Liked songs</p>
          </button>
          <hr className="border-t-[0.1px]  border-gray-900" />

          {/* Playlists */}
          {playlists.map((playlist: any) => (
                <p
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                  key={playlist.id}
                  className="cursor-pointer hover:text-white"
                >
                  {playlist.name}
                </p>
              ))}
        </div>
      </div>
    </aside>
  );
};

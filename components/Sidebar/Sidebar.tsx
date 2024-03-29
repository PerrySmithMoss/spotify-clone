import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  LogoutIcon,
  PlusCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useAppStore } from "../../store/AppStore";
import { useSpotify } from "../../hooks/useSpotify";
import { useRouter } from "next/router";
import sidebarStyles from "./sidebar.module.css";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const { data: session, status } = useSession();
  // const [playlists, setPlaylists] = useState<any>([]);
  const [song, setSong] = useState<any>();
  const {
    setSelectedPlaylistId,
    selectedPlaylistId,
    userPlaylists,
    selectedPlaylist,
    setSelectedPlaylist,
    setLibraryCollectionSelected,
    setUserPlaylists,
  } = useAppStore();

  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      spotifyAPI.getUserPlaylists().then((data) => {
        setUserPlaylists(data.body.items);
      });
    }
  }, [session, spotifyAPI]);

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
  };

  const handleSelectLikedSongs = () => {
    setLibraryCollectionSelected("tracks");
    router.push("/collections/tracks");
  };

  return (
    <aside className="hidden md:block bg-spotify-black">
      <div className="flex  justify-center w-full px-5 pt-5 pb-2 mt-2">
        <span className="w-full h-full flex ">
          <Link href="/">
            <svg
              height="41px"
              width="131px"
              fill="black"
              viewBox="0 0 63 20"
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMin meet"
            >
              <g fillRule="evenodd" fill="white">
                <path d="M61.842 9.506a1.02 1.02 0 0 1-1.023-1.024c0-.562.453-1.03 1.029-1.03a1.02 1.02 0 0 1 1.023 1.024 1.03 1.03 0 0 1-1.029 1.03m.006-1.952a.915.915 0 0 0-.922.928c0 .51.394.921.916.921a.916.916 0 0 0 .922-.927.908.908 0 0 0-.916-.922m.226 1.027l.29.406h-.244l-.26-.372h-.225v.372h-.204V7.912h.48c.249 0 .413.128.413.343 0 .176-.102.284-.25.326m-.172-.485h-.267v.34h.267c.133 0 .212-.065.212-.17 0-.11-.08-.17-.212-.17m-12.804-3.52a1.043 1.043 0 1 0-.001 2.086 1.043 1.043 0 0 0 0-2.087m.72 2.89h-1.454a.107.107 0 0 0-.106.107v6.346c0 .06.047.107.106.107h1.455a.107.107 0 0 0 .107-.107V7.572a.107.107 0 0 0-.107-.107m3.233.006v-.2c0-.592.227-.856.736-.856.303 0 .546.06.82.152a.106.106 0 0 0 .14-.102V5.24a.107.107 0 0 0-.076-.102 3.993 3.993 0 0 0-1.21-.174c-1.343 0-2.053.757-2.053 2.188v.308h-.699a.107.107 0 0 0-.107.106v1.257c0 .059.048.107.107.107h.699v4.99c0 .058.047.106.106.106h1.455a.107.107 0 0 0 .106-.107v-4.99h1.358l2.081 4.99c-.236.523-.468.628-.785.628-.257 0-.527-.077-.803-.228a.109.109 0 0 0-.084-.008.106.106 0 0 0-.063.058l-.493 1.081a.106.106 0 0 0 .045.138c.515.279.98.398 1.554.398 1.074 0 1.668-.5 2.191-1.847L60.6 7.617a.106.106 0 0 0-.099-.146h-1.514a.107.107 0 0 0-.1.072l-1.552 4.431-1.7-4.434a.106.106 0 0 0-.099-.069h-2.485m-5.577-.006h-1.6V5.828a.106.106 0 0 0-.107-.106h-1.455a.107.107 0 0 0-.106.106v1.637h-.7a.106.106 0 0 0-.106.107v1.25c0 .059.048.107.106.107h.7v3.234c0 1.308.65 1.97 1.934 1.97.522 0 .954-.107 1.362-.338a.106.106 0 0 0 .054-.093v-1.19a.106.106 0 0 0-.154-.096c-.28.141-.551.206-.854.206-.467 0-.675-.211-.675-.686V8.929h1.6a.106.106 0 0 0 .107-.107v-1.25a.106.106 0 0 0-.106-.107m-7.671-.133c-1.96 0-3.497 1.51-3.497 3.437 0 1.907 1.526 3.4 3.473 3.4 1.967 0 3.508-1.504 3.508-3.424 0-1.914-1.53-3.413-3.484-3.413m0 5.362c-1.043 0-1.83-.838-1.83-1.95 0-1.115.76-1.924 1.806-1.924 1.05 0 1.84.838 1.84 1.95 0 1.115-.763 1.924-1.816 1.924m-7.014-5.362c-.82 0-1.492.323-2.046.984v-.744a.107.107 0 0 0-.106-.107h-1.455a.107.107 0 0 0-.106.107v8.27c0 .058.048.106.106.106h1.455a.107.107 0 0 0 .106-.106v-2.61c.555.621 1.227.925 2.046.925 1.522 0 3.063-1.172 3.063-3.412s-1.54-3.413-3.063-3.413m1.372 3.413c0 1.14-.703 1.937-1.709 1.937-.995 0-1.745-.833-1.745-1.937s.75-1.937 1.745-1.937c.99 0 1.71.814 1.71 1.937m-8.437-1.81c-1.624-.388-1.913-.66-1.913-1.231 0-.54.508-.903 1.264-.903.732 0 1.459.275 2.22.843a.107.107 0 0 0 .15-.023l.794-1.119a.107.107 0 0 0-.02-.144c-.906-.728-1.927-1.081-3.12-1.081-1.755 0-2.98 1.052-2.98 2.559 0 1.615 1.057 2.187 2.884 2.628 1.554.358 1.817.658 1.817 1.195 0 .594-.53.963-1.385.963-.948 0-1.721-.32-2.587-1.068a.11.11 0 0 0-.078-.026.105.105 0 0 0-.073.038l-.89 1.058a.105.105 0 0 0 .011.148 5.303 5.303 0 0 0 3.581 1.373c1.89 0 3.112-1.033 3.112-2.631 0-1.351-.807-2.098-2.787-2.58M9.507.305a9.41 9.41 0 1 0 0 18.82 9.41 9.41 0 0 0 0-18.82m4.316 13.572a.586.586 0 0 1-.807.195c-2.21-1.35-4.99-1.655-8.266-.907a.586.586 0 1 1-.261-1.143c3.584-.82 6.659-.467 9.139 1.049.276.169.363.53.195.806m1.15-2.562a.734.734 0 0 1-1.008.242c-2.529-1.555-6.385-2.005-9.377-1.097a.735.735 0 0 1-.426-1.404c3.418-1.037 7.666-.534 10.57 1.25a.734.734 0 0 1 .242 1.01m.1-2.669C12.04 6.846 7.036 6.68 4.141 7.56a.88.88 0 1 1-.511-1.684c3.323-1.01 8.849-.814 12.34 1.258a.88.88 0 0 1-.898 1.514"></path>
              </g>
            </svg>
          </Link>
        </span>
      </div>
      <div className="text-gray-500 p-5 mt-1 text-sm border-r border-black overflow-y-scroll h-screen scrollbar-hide sm:w-[12rem] lg:w-[15rem] hidden md:inline-flex ">
        <div className="space-y-4 w-full ml-0">
          <Link href={`/`}>
            <button
              className={
                router.pathname === "/"
                  ? `flex items-center space-x-2 text-white`
                  : `flex items-center space-x-2 hover:text-white`
              }
            >
              <svg
                height={24}
                width={24}
                viewBox="0 0 24 24"
                className=" shrink-0"
                fill="#b3b3b3"
              >
                <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 013 0l7.5 4.33a2 2 0 011 1.732V21a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-6h-3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7.577a2 2 0 011-1.732l7.5-4.33z"></path>
              </svg>
              <p>Home</p>
            </button>
          </Link>
          <Link href="/search">
            <button
              className={
                router.pathname === "/search"
                  ? `flex items-center space-x-2 text-white`
                  : `flex items-center space-x-2 hover:text-white`
              }
            >
              <svg
                height={24}
                width={24}
                viewBox="0 0 24 24"
                className=" shrink-0"
                fill="#b3b3b3"
              >
                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
              </svg>
              <p>Search</p>
            </button>
          </Link>
          <Link href={`/collections/playlists`}>
            <button
              className={
                router.asPath === "/collections/playlists" ||
                router.asPath === "/collections/podcasts" ||
                router.asPath === "/collections/artists" ||
                router.asPath === "/collections/albums"
                  ? `flex items-center space-x-2 text-white`
                  : `flex items-center space-x-2 hover:text-white`
              }
            >
              <svg
                height={24}
                width={24}
                viewBox="0 0 24 24"
                className=" shrink-0"
                fill="#b3b3b3"
              >
                <path d="M14.5 2.134a1 1 0 011 0l6 3.464a1 1 0 01.5.866V21a1 1 0 01-1 1h-6a1 1 0 01-1-1V3a1 1 0 01.5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm6 0a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1z"></path>
              </svg>
              <p>Your Library</p>
            </button>
          </Link>

          {/* <button className="flex items-center pt-4 space-x-2 hover:text-white">
            <PlusCircleIcon className="h-7 w-7" />
            <p>Create Playlist</p>
          </button> */}
          <button
            onClick={() => handleSelectLikedSongs()}
            className={
              router.asPath === "/collections/tracks"
                ? `flex items-center space-x-2 pt-4 text-white`
                : `flex items-center space-x-2 pt-4 hover:text-white`
            }
          >
            <div className={sidebarStyles.likedSongsIconContainer}>
              <div className={sidebarStyles.likedSongsIcon}>
                <svg height={12} width={12} fill="white" viewBox="0 0 16 16">
                  <path d="M15.724 4.22A4.313 4.313 0 0012.192.814a4.269 4.269 0 00-3.622 1.13.837.837 0 01-1.14 0 4.272 4.272 0 00-6.21 5.855l5.916 7.05a1.128 1.128 0 001.727 0l5.916-7.05a4.228 4.228 0 00.945-3.577z"></path>
                </svg>
              </div>
            </div>

            <p>Liked songs</p>
          </button>
          <hr className="border-t-[0.1px]  border-[#282828]" />

          {/* Playlists */}
          {userPlaylists.map((playlist: any) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
              <p
                onClick={() => handleSelectPlaylist(playlist.id)}
                key={playlist.id}
                className="cursor-pointer hover:text-white"
              >
                {playlist.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

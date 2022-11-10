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
// import { Songs } from "../Song/Songs";
import { ClockIcon } from "@heroicons/react/outline";
import collectionStyles from "./collection.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

interface PlaylistCollectionProps {}

export const PlaylistCollection: React.FC<PlaylistCollectionProps> = ({}) => {
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const [colour, setColour] = useState<any>(null);
  const [usersTopTracks, setUsersTopTracks] = useState<any[]>([]);
  const {
    libraryCollectionSelected,
    setLibraryCollectionSelected,
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
    userPlaylists,
    setUserPlaylists,
    setSelectedPlaylistId,
  } = useAppStore();

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [libraryCollectionSelected]);

  useEffect(() => {
    if (libraryCollectionSelected === "playlists") {
      spotifyAPI
        .getUserPlaylists()
        .then((data) => {
          setUserPlaylists(data.body.items);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, libraryCollectionSelected]);

  useEffect(() => {
    if (typeof libraryCollectionSelected === "string") {
      spotifyAPI
        .getMyTopTracks()
        .then((data) => {
          setUsersTopTracks(data.body.items);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, libraryCollectionSelected]);

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
  };

  const handleCollectionChange = (
    collection: "playlists" | "podcasts" | "artists" | "albums"
  ) => {
    setLibraryCollectionSelected(collection);
    router.push(`/collections/${collection}`);
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
          <div className="flex items-center">
            <nav className=" pl-6 w-full ">
              <ul className="block text-white">
                <li className="inline-block">
                  <a
                    onClick={() => handleCollectionChange("playlists")}
                    className={
                      router.asPath === "/collections/playlists"
                        ? `bg-[#333] mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                        : `mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                    }
                  >
                    <span className="text-sm font-bold">Playlists</span>
                  </a>
                </li>
                <li className="inline-block">
                  <a
                    onClick={() => handleCollectionChange("podcasts")}
                    className={
                      router.asPath === "/collections/podcasts"
                        ? `bg-[#333] mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                        : `mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                    }
                  >
                    <span className="text-sm font-bold">Podcasts</span>
                  </a>
                </li>
                <li className="inline-block">
                  <a
                    onClick={() => handleCollectionChange("artists")}
                    className={
                      router.asPath === "/collections/artists"
                        ? `bg-[#333] mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                        : `mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                    }
                  >
                    <span className="text-sm font-bold">Artists</span>
                  </a>
                </li>
                <li className="inline-block">
                  <a
                    onClick={() => handleCollectionChange("albums")}
                    className={
                      router.asPath === "/collections/albums"
                        ? `bg-[#333] mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                        : `mr-2 rounded inline-block py-2 px-4 relative cursor-pointer`
                    }
                  >
                    <span className="text-sm font-bold">Albums</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
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
      <section className="ml-8 mr-8">
        <h1 className="mt-6 text-2xl font-bold text-white">Playlists</h1>
        <div className="mt-4">
          <div className={`${collectionStyles.topTracksGrid}`}>
            {/* Liked songs */}
            <div
              className={`${collectionStyles.likedSongs} ${collectionStyles.likedSongsBox}`}
            >
              <div className="flex flex-col gap-5 h-full">
                <div className=" items-end flex flex-[1] mb-3">
                  <div className=" max-h-[140px] line-clamp-3 overflow-hidden text-ellipsis whitespace-normal w-full">
                    {usersTopTracks.map((track: any) => (
                      <span key={track.id}>
                        <span className=" opacity-[0.7]"></span>
                        <span>{track.artists[0].name}</span>
                        <span className={collectionStyles.trackName}>
                          {track.name} •
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className=" min-h-[62px]">
                  <a className=" relative z-10 inline-block max-w-full align-middle">
                    <div className=" text-[2rem] no-underline text-white ">
                      Liked songs
                    </div>
                    <div className="text-sm mt-3">2270 liked songs</div>
                  </a>
                </div>
              </div>
            </div>
            {/* Playlists */}
            {userPlaylists.map((playlist: any) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <div
                  key={playlist.id}
                  onClick={() => handleSelectPlaylist(playlist.id)}
                  className={`${collectionStyles.playlist} cursor-pointer hover:bg-[#282828]`}
                >
                  <div className="h-full">
                    <div className=" relative mb-4">
                      <div className={collectionStyles.playlistImage}>
                        <div>
                          <img
                            className={`h-full left-0 absolute top-0 w-full block ${collectionStyles.cardImage}`}
                            src={playlist.images[0].url}
                            alt={playlist.name}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="min-h-[62px]">
                      <a
                        href="#"
                        className=" z-10 relative inline-block max-w-full align-middle"
                      >
                        <div className=" text-white text-[1rem] leading-[1.5rem] no-underline tracking-normal font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                          {playlist.name}
                        </div>
                      </a>
                      <div className=" text-[#6a6a6a] text-[0.875rem] leading-[1rem] tracking-normal font-normal mt-1 overflow-hidden text-ellipsis whitespace-normal">
                        {playlist.description === ""
                          ? playlist.owner.display_name
                          : playlist.description}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

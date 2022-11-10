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

interface AlbumCollectionProps {}

export const AlbumCollection: React.FC<AlbumCollectionProps> = ({}) => {
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const [colour, setColour] = useState<any>(null);
  const [userAlbums, setUserAlbums] = useState<any[]>([]);
  const {
    libraryCollectionSelected,
    setLibraryCollectionSelected,
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
    setSelectedAlbumId,
  } = useAppStore();

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [libraryCollectionSelected]);

  useEffect(() => {
    if (libraryCollectionSelected === "albums") {
      spotifyAPI
        .getMySavedAlbums()
        .then((data) => {
          setUserAlbums(data.body.items);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, libraryCollectionSelected]);

  const handleSelectAlbum = (id: string) => {
    setSelectedAlbumId(id);

    router.push(`/album/${id}`);
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
        <h1 className="mt-6 text-2xl font-bold text-white">Artists</h1>
        <div className="mt-4">
          <div className={`${collectionStyles.topTracksGrid}`}>
            {/* Playlists */}
            {userAlbums.map((album: any) => (
              <div
                onClick={() => handleSelectAlbum(album.album.id)}
                key={album.album.id}
                className=" hover:bg-[#282828] cursor-pointer rounded-md p-2 pb-6"
              >
                <img
                  className="rounded-md h-[190px] w-full p-2"
                  src={album.album.images[0].url}
                  alt="Artist profile picture"
                />

                <div className="ml-2 mt-1.5">
                  <p className="text-white hover:underline truncate">
                    {album.album.name}
                  </p>
                  <p className="mt-0.5 text-[#b3b3b3] text-sm truncate">
                    {album.album.artists[0].name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import { ClockIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { colourFor } from "../../constants/colors";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import { milliSecondsToHours } from "../../utils/time";
import { Songs } from "../Song/Songs";
import mainStyles from "./main.module.css";

interface MainProps {}

export const Main: React.FC<MainProps> = ({}) => {
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const {
    selectedPlaylistId: storedId,
    selectedPlaylist,
    setSelectedPlaylist,
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
  } = useAppStore();
  const selectedPlaylistId =
    typeof router.query.id === "string" ? router.query.id : storedId;

  const colour = colourFor(String(selectedPlaylistId ?? ""));

  useEffect(() => {
    if (typeof selectedPlaylistId === "string") {
      spotifyAPI
        .getPlaylist(selectedPlaylistId as string)
        .then((data) => {
          setSelectedPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedPlaylistId, setSelectedPlaylist]);
  return (
    <div className="grow h-screen bg-[#121212] overflow-y-scroll scrollbar-hide select-none relative">
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${mainStyles.iconLeft} cursor-not-allowed`
                : `${mainStyles.iconLeft}`
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
          <Image
            alt=""
            width={300}
            height={300}
            sizes="(max-width: 768px) 50vw, 240px"
            className="rounded-full w-8 h-8 text-white"
            src={
              (session?.user?.image ?? undefined) ||
              "/assets/images/placeholder.svg"
            }
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
      {selectedPlaylist && (
        <section
          className={`flex items-end space-x-7 bg-linear-to-b to-spotify-gray ${colour} h-[290px] text-white pl-7 pb-5`}
        >
          <Image
            width={300}
            height={300}
            sizes="(max-width: 768px) 50vw, 240px"
            className="w-56 h-56 shadow-2xl"
            src={
              selectedPlaylist?.images[0]?.url ||
              "/assets/images/placeholder.svg"
            }
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
                  {selectedPlaylist?.owner?.display_name
                    ? selectedPlaylist?.owner?.display_name
                    : session?.user?.name}
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
                      0,
                    ),
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

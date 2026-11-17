import { ClockIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { colourFor } from "../../../constants/colors";
import { useSpotify } from "../../../hooks/useSpotify";
import { useAppStore } from "../../../store/AppStore";
import { milliSecondsToHoursMinutesAndSeconds } from "../../../utils/time";
import albumStyles from "./album.module.css";
import { AlbumTracks } from "./AlbumTracks";

interface AlbumProps {}

export const Album: React.FC<AlbumProps> = ({}) => {
  const {
    selectedAlbumId: storedId,
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
    selectedAlbum,
    setSelectedAlbum,
    setSelectedAlbumId,
  } = useAppStore();
  const router = useRouter();
  const selectedAlbumId =
    typeof router.query.id === "string" ? router.query.id : storedId;
  const { data: session } = useSession();
  const spotifyAPI = useSpotify();
  const [artistAlbums, setArtistAlbums] = useState<any>([]);

  const colour = colourFor(String(selectedAlbumId ?? ""));

  useEffect(() => {
    if (typeof selectedAlbumId === "string") {
      spotifyAPI
        .getAlbum(selectedAlbumId)
        .then((data) => {
          setSelectedAlbum(data.body);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedAlbumId, setSelectedAlbum]);

  const artistId = selectedAlbum?.artists?.[0]?.id;
  useEffect(() => {
    if (typeof artistId === "string") {
      spotifyAPI
        .getArtistAlbums(artistId)
        .then((data) => {
          setArtistAlbums(data.body.items);
        })
        .catch((err) =>
          console.log(
            "Something went wrong while trying to fetch artists albums: ",
            err,
          ),
        );
    }
  }, [spotifyAPI, artistId]);

  const handleSelectAlbum = (id: string) => {
    setSelectedAlbumId(id);
    router.push(`/album/${id}`);
  };

  return (
    <div className="grow pb-28 h-screen bg-[#121212] overflow-y-scroll scrollbar-hide select-none relative">
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${albumStyles.iconLeft} cursor-not-allowed`
                : `${albumStyles.iconLeft}`
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
      {selectedAlbum ? (
        <>
          <section
            className={`flex items-end space-x-7 bg-linear-to-b to-spotify-gray ${colour} h-[280px] text-white pl-7 pb-5`}
          >
            <Image
              width={300}
              height={300}
              sizes="(max-width: 768px) 50vw, 240px"
              className="w-56 h-56 shadow-2xl"
              src={
                selectedAlbum?.images[0]?.url ||
                "/assets/images/placeholder.svg"
              }
              alt="Artist picture"
            />
            <div className="pb-4">
              <p className="uppercase text-xs font-medium tracking-wide">
                Artist
              </p>
              <h1 className="mt-4 text-2xl md:text-4xl lg:text-7xl font-bold">
                {selectedAlbum?.name}
              </h1>
              <div className="flex content-center items-center text-sm space-x-1 mt-5">
                <div>
                  <Image
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 50vw, 240px"
                    className="h-6 w-6"
                    src={
                      selectedAlbum?.images[0]?.url ||
                      "/assets/images/placeholder.svg"
                    }
                    alt="Artist profile picture"
                  />
                </div>
                <div className="pl-1">
                  <p className="font-medium tracking-wide">
                    {selectedAlbum?.artists[0].name}
                  </p>
                </div>
                <div>•</div>
                <div>
                  <span className="font-light">
                    {selectedAlbum?.release_date}
                  </span>
                </div>
                <div>•</div>
                <div>
                  <span className="font-light">
                    {selectedAlbum?.total_tracks} songs,
                  </span>
                </div>
                <div>
                  <span className=" font-medium text-gray-500">
                    {milliSecondsToHoursMinutesAndSeconds(
                      selectedAlbum.tracks.items.reduce(
                        (acc: any, currentSong: any) =>
                          acc + currentSong.duration_ms,
                        0,
                      ),
                    )}{" "}
                    sec
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="px-5">
              <div
                className={`${albumStyles.grid} grid grid-cols-2 uppercase tracking-wider text-xs font-medium px-2  text-[#929292] hover:text-white rounded-md mt-2`}
              >
                <div className="flex items-center pl-3 space-x-8 py-1 w-full">
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
              <div className="px-7 flex bg-[#121212] flex-col mt-3 space-y-2 text-white">
                {selectedAlbum?.tracks.items.map((song: any, i: number) => (
                  <AlbumTracks key={song.id} song={song} order={i} />
                ))}
              </div>
              <div className="mt-4 ml-8">
                {selectedAlbum.copyrights.map(
                  (copyright: any, index: number) => (
                    <p key={index} className="text-gray-200 text-[11px]">
                      © {copyright.text}
                    </p>
                  ),
                )}
              </div>
            </div>
          </section>
          <section className="mt-10 ml-7">
            <h3 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              More by {selectedAlbum?.artists[0].name}
            </h3>
            <div
              className={`mt-6 ml-3 grid grid-flow-col auto-cols-max auto-rows-max gap-8 overflow-y-hidden scrollbar-hide`}
            >
              {artistAlbums &&
                artistAlbums?.map((album: any) => (
                  <div
                    key={album.id}
                    onClick={() => handleSelectAlbum(album.id)}
                  >
                    <div>
                      <Image
                        width={300}
                        height={300}
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="rounded-md h-48 w-48 "
                        src={
                          album.images[0].url ||
                          "/assets/images/placeholder.svg"
                        }
                        alt={album.name}
                      />
                    </div>
                    <div className="w-48 mt-1.5">
                      <p className="truncate text-white">{album.name}</p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </>
      ) : (
        <div className="text-white">You must select a valid artist.</div>
      )}
    </div>
  );
};

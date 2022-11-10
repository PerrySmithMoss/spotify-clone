import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import artistStyles from "./artist.module.css";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { shuffleArrayOfStrings } from "../../../utils/shuffleArray";
import { colours } from "../../../constants/colors";
import { ArtistsTopTracks } from "./ArtistsTopTracks";
import { useSpotify } from "../../../hooks/useSpotify";

interface ArtistProps {}

export const Artist: React.FC<ArtistProps> = ({}) => {
  const {
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
    selectedArtistId,
    selectedArtist,
    setSelectedArtist,
    setSelectedArtistId,
    setSelectedAlbumId
  } = useAppStore();
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const { data: session } = useSession();
  const [colour, setColour] = useState<any>(null);
  const [artistsTopTracks, setArtistsTopTracks] = useState<object[]>([]);
  const [artistsAlbums, setArtistsAlbums] = useState<object[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<object[]>([]);
  const [isShowMore, setIsShowMore] = useState(false);

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [selectedArtistId]);

  useEffect(() => {
    if (typeof selectedArtistId === "string") {
      spotifyAPI
        .getArtist(selectedArtistId)
        .then((data) => {
          setSelectedArtist(data.body);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedArtistId]);
  
  useEffect(() => {
    if (typeof selectedArtistId === "string") {
      spotifyAPI
        .getArtistTopTracks(selectedArtistId, "GB")
        .then((data) => {
          setArtistsTopTracks(data.body.tracks);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedArtistId]);

  useEffect(() => {
    if (typeof selectedArtistId === "string") {
      spotifyAPI
        .getArtistAlbums(selectedArtistId, { limit: 5 })
        .then((data) => {
          setArtistsAlbums(data.body.items);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedArtistId]);

  useEffect(() => {
    if (typeof selectedArtistId === "string") {
      spotifyAPI
        .getArtistRelatedArtists(selectedArtistId)
        .then((data) => {
          setRelatedArtists(data.body.artists);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedArtistId]);

  const handleSelectArtist = (id: string) => {
    setSelectedArtistId(id);
    router.push(`/artist/${id}`);
  };

  const handleSelectAlbum = (id: string) => {
    setSelectedAlbumId(id);
    router.push(`/album/${id}`);
  };

  return (
    <div className="flex-grow pb-28 h-screen bg-[#121212] overflow-y-scroll scrollbar-hide select-none relative">
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${artistStyles.iconLeft} cursor-not-allowed`
                : `${artistStyles.iconLeft}`
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
      {selectedArtist ? (
        <>
          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-spotify-gray ${colour} h-[280px] text-white pl-7 pb-5`}
          >
            <img
              className="w-56 h-56 shadow-2xl"
              src={selectedArtist?.images[0]?.url}
              alt="Artist picture"
            />
            <div className="pb-3">
              <p className="uppercase text-xs font-medium tracking-wide">
                Artist
              </p>
              <h1 className="mt-4 text-2xl md:text-4xl lg:text-7xl font-bold">
                {selectedArtist?.name}
              </h1>
              <div className="flex content-center items-center text-sm space-x-1 mt-5">
                <div>
                  <span className="font-light">
                    {Number(selectedArtist?.followers.total).toLocaleString()}{" "}
                    followers
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section className="ml-7">
            <h3 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Popular
            </h3>
            <div className="mt-4">
              {isShowMore ? (
                <>
                  {artistsTopTracks?.map((song: any, i: number) => (
                    <ArtistsTopTracks key={song.id} song={song} order={i} />
                  ))}
                </>
              ) : (
                <>
                  {artistsTopTracks?.slice(0, 5).map((song: any, i: number) => (
                    <ArtistsTopTracks key={song.id} song={song} order={i} />
                  ))}
                </>
              )}
            </div>
            <div className="ml-3 mt-2">
              <button
                disabled={
                  artistsTopTracks.length === 0
                }
                onClick={() => setIsShowMore(!isShowMore)}
                className={artistsTopTracks.length === 0 ? `cursor-not-allowed uppercase text-xs text-[#b3b3b3] tracking-wider` : `uppercase text-xs text-[#b3b3b3] tracking-wider`}
              >
                {isShowMore ? "Show Less" : "Show More"}
              </button>
            </div>
          </section>
          <section className="mt-10 ml-7">
            <h3 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Albums
            </h3>
            <div
              className={`mt-6 ml-0 grid grid-flow-col auto-cols-max auto-rows-max gap-2 overflow-y-hidden scrollbar-hide`}
            >
              {artistsAlbums &&
                artistsAlbums?.map((album: any) => (
                  <div
                  className=" cursor-pointer hover:bg-[#282828] p-3"
                  key={album.id}
                  onClick={() => handleSelectAlbum(album.id)}
                  >
                    <div>
                      <img
                        className="rounded-md h-48 w-48 "
                        src={album.images[0].url}
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
          <section className="mt-10 ml-7">
            <h3 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Related artists
            </h3>
            <div
              className={`mt-6 ml-0 grid grid-flow-col auto-cols-max auto-rows-max gap-2 overflow-y-hidden scrollbar-hide`}
            >
              {relatedArtists &&
                relatedArtists?.slice(0, 10).map((relatedArtist: any) => (
                  <div
                    onClick={() => handleSelectArtist(relatedArtist.id)}
                    className=" cursor-pointer hover:bg-[#282828] p-3"
                    key={relatedArtist.id}
                  >
                    <div>
                      <img
                        className="rounded-md h-48 w-48 "
                        src={relatedArtist.images[0].url}
                        alt={relatedArtist.name}
                      />
                    </div>
                    <div className="w-48 mt-1.5">
                      <p className="truncate text-white">
                        {relatedArtist.name}
                      </p>
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

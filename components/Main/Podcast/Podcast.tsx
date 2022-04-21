import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../store/AppStore";
import podcastStyles from "./podcast.module.css";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { shuffleArrayOfStrings } from "../../../utils/shuffleArray";
import { colours } from "../../../constants/colors";
import { useSpotify } from "../../../hooks/useSpotify";
import { ClockIcon } from "@heroicons/react/outline";
import { milliSecondsToHours } from "../../../utils/time";
import { PodcastEpisode } from "./PodcastEpisode";

interface PodcastProps {}

export const Podcast: React.FC<PodcastProps> = ({}) => {
  const {
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
    selectedPodcastId,
    selectedPodcast,
    setSelectedPodcast,
    setSelectedPodcastId,
  } = useAppStore();
  const spotifyAPI = useSpotify();
  const router = useRouter();
  const { data: session } = useSession();
  const [colour, setColour] = useState<any>(null);
  const [podcastEpisodes, setPodcastEpisodes] = useState<object[]>([]);
  const [isShowMore, setIsShowMore] = useState(false);

  useEffect(() => {
    setColour(shuffleArrayOfStrings(colours).pop());
  }, [selectedPodcastId]);

  useEffect(() => {
    if (typeof selectedPodcastId === "string") {
      spotifyAPI
        .getShow(selectedPodcastId)
        .then((data) => {
          setSelectedPodcast(data.body);
        })
        .catch((err) => console.log("Something went wrong: ", err));
    }
  }, [spotifyAPI, selectedPodcastId]);

  //   useEffect(() => {
  //     if (typeof selectedPodcastId === "string") {
  //       spotifyAPI
  //         .getShowEpisodes(selectedPodcastId)
  //         .then((data) => {
  //           setPodcastEpisodes(data.body.items);
  //         })
  //         .catch((err) => console.log("Something went wrong: ", err));
  //     }
  //   }, [spotifyAPI, selectedPodcastId]);

    // console.log("Show: ", selectedPodcast);
  // console.log(podcastEpisodes)

  //   useEffect(() => {
  //     if (typeof selectedPodcastId === "string") {
  //       spotifyAPI
  //         .getArtistTopTracks(selectedPodcastId, "GB")
  //         .then((data) => {
  //           setArtistsTopTracks(data.body.tracks);
  //         })
  //         .catch((err) => console.log("Something went wrong: ", err));
  //     }
  //   }, [spotifyAPI, selectedPodcastId]);

  //   useEffect(() => {
  //     if (typeof selectedPodcastId === "string") {
  //       spotifyAPI
  //         .getArtistAlbums(selectedPodcastId, { limit: 5 })
  //         .then((data) => {
  //           setArtistsAlbums(data.body.items);
  //         })
  //         .catch((err) => console.log("Something went wrong: ", err));
  //     }
  //   }, [spotifyAPI, selectedPodcastId]);

  //   useEffect(() => {
  //     if (typeof selectedPodcastId === "string") {
  //       spotifyAPI
  //         .getArtistRelatedArtists(selectedPodcastId)
  //         .then((data) => {
  //           setRelatedArtists(data.body.artists);
  //           console.log("Related artists: : ", data.body.artists);
  //         })
  //         .catch((err) => console.log("Something went wrong: ", err));
  //     }
  //   }, [spotifyAPI, selectedPodcastId]);

  //   const handleSelectArtist = (id: string) => {
  //     setselectedPodcastId(id);
  //     router.push(`/artist/${id}`);
  //   };

  //   const handleSelectAlbum = (id: string) => {
  //     setSelectedAlbumId(id);
  //     router.push(`/album/${id}`);
  //   };

  return (
    <div className="flex-grow pb-28 h-screen bg-[#121212] overflow-y-scroll scrollbar-hide select-none relative">
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${podcastStyles.iconLeft} cursor-not-allowed`
                : `${podcastStyles.iconLeft}`
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
      {selectedPodcast ? (
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-spotify-gray ${colour} h-[290px] text-white pl-7 pb-5`}
        >
          <img
            className="w-56 h-56 shadow-2xl rounded-lg"
            src={selectedPodcast?.images[0]?.url}
            alt="Playlist picture"
          />
          <div>
            <p className="uppercase text-xs font-medium tracking-wide">
              Playlist
            </p>
            <h1 className="mt-4 text-2xl md:text-4xl lg:text-6xl font-bold">
              {selectedPodcast?.name}
            </h1>
            <div className="flex content-center items-center text-sm space-x-1 mt-5">
              <div>
                <p className="font-medium text-lg tracking-wide">
                  {selectedPodcast.publisher}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-white">You must select a valid podcast.</div>
      )}
      <div className="mx-7">
      <div className="mt-4">
        <div className="grid grid-cols-12 gap-6">
          <div className=" col-span-8">
            <h4 className="text-white mt-4 text-2xl md:text-xl lg:text-2xl font-bold">
              All Episodes
            </h4>
            {selectedPodcast?.episodes?.items?.map((episode: any) => (
              <PodcastEpisode episode={episode} key={episode.id} />
            ))}
            <hr className={`${podcastStyles.border}`} />
          </div>
          <div className=" col-span-4">
          <h4 className="text-white mt-4 text-2xl md:text-xl lg:text-2xl font-bold">
              About
            </h4>
            <p className="mt-3 text-[#b3b3b3] text-sm leading-relaxed">{selectedPodcast?.html_description}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import { debounce } from "../../utils/debounce";
import searchStyles from "./search.module.css";
import { SearchResults } from "./SearchResults";
import { YourTopGenres } from "./YourTopGenres";

interface SearchContainerProps {}

export const SearchContainer: React.FC<SearchContainerProps> = ({}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<object>({});
  const spotifyAPI = useSpotify();
  const {
    isProfileDrodownOpen,
    setIsProfileDrodownOpen,
  } = useAppStore();

  const fetchSongs: (search: string) => void = useCallback(
    debounce(async (string: string) => {
      spotifyAPI
        .search(string, ["track", "playlist", "show", "album", "artist"], {
          limit: 5,
          offset: 0,
        })
        .then((res: any) => {
          // console.log("Search results: ", res.body)
          setSearchResults(
            res.body
            // .tracks.items.map((track: any) => {
            //   return {
            //     id: track.id,
            //     artist: track.artists[0],
            //     title: track.name,
            //     uri: track.uri,
            //     albumUrl: track.album.images[0].url,
            //     popularity: track.popularity,
            //     previewUrl: track.preview_url,
            //   };
            // }
            // )
          );
        })
        .catch((error: any) => {
          console.error("Error: ", error.statusCode);
        });
    }, 1000),
    []
  );
  useEffect(() => {
    searchInput && fetchSongs(searchInput);
  }, [searchInput]);

  return (
    <div className="flex-grow bg-spotify-gray  h-screen overflow-y-scroll scrollbar-hide select-none relative">
      <header className="flex justify-between mt-6 px-8">
        <div className="flex space-x-4">
          <button
            disabled={router.pathname === "/"}
            onClick={() => router.back()}
            className={
              router.pathname === "/"
                ? `${searchStyles.iconLeft} cursor-not-allowed`
                : `${searchStyles.iconLeft}`
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
          <div className=" flex-grow whitespace-nowrap">
            <div className="flex items-center">
              <div className={`${searchStyles.searchContainer}`}>
                <form role="search">
                  <input
                    className={`${searchStyles.searchForm}`}
                    type="text"
                    name="searchInput"
                    maxLength={400}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Search songs"
                    id="searchInput"
                    onChange={(e) => setSearchInput(e.currentTarget.value)}
                    value={searchInput}
                  />
                </form>
                <div className={`${searchStyles.searchInputWrapper}`}>
                  <span className={`${searchStyles.searchInputContainer}`}>
                    <svg role="img" height={24} width={24} viewBox="0 0 24 24">
                      <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
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
      <section
        className={`px-10 mt-6 bg-gradient-to-b to-spotify-gray  h-40 text-white pb-5 border-spotify-black `}
      >
        <div className="mt-10">
          {Object.keys(searchResults as object).length > 0 ? (
            <SearchResults searchResults={searchResults} />
          ) : (
            <div className="mt-10">
            <YourTopGenres />
          </div>
          )}
        </div>
        {/* <div className="mt-12 flex justify-between items-center content-center">
          <div>
            <h1 className="text-white text-xl md:text-2xl lg:text-2xl font-bold">
              Browse all
            </h1>
          </div>
        </div> */}
      </section>
    </div>
  );
};

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSpotify } from "../../hooks/useSpotify";
import { useAppStore } from "../../store/AppStore";
import { milliSecondsToMinutesAndSeconds } from "../../utils/time";
import searchStyles from "./search.module.css";

interface SearchResultsProps {
  searchResults: any;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
}) => {
  const [artistInfo, setArtistInfo] = useState<any>({});
  const spotifyAPI = useSpotify();
  const {
    setSelectedPlaylistId,
    setSelectedArtistId,
    setSelectedAlbumId,
    setSelectedPodcastId,
  } = useAppStore();
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { setCurrentTrackId, setIsPlaying } = useAppStore();

  const getArtist = (id: string) => {
    spotifyAPI
      .getArtist(id)
      .then((res: any) => {
        setArtistInfo(res.body);
        // console.log(res)
      })
      .catch((error: any) => {
        console.error("Error: ", error.statusCode);
      });
  };

  const playSong = (song: any) => {
    setCurrentTrackId(song.id);
    setIsPlaying(true);
    spotifyApi
      .play({
        uris: [song.uri],
      })
      .catch((err) => {
        console.log("There was an error while trying to play song: ", err);
      });
  };

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
    router.push(`/playlist/${id}`);
  };

  const handleSelectArtist = (id: string) => {
    setSelectedArtistId(id);
    router.push(`/artist/${id}`);
  };

  const handleSelectAlbum = (id: string) => {
    setSelectedAlbumId(id);
    router.push(`/album/${id}`);
  };

  const handleSelectPodcast = (id: string) => {
    setSelectedPodcastId(id);
    router.push(`/podcast/${id}`);
  };

  useEffect(() => {
    Object.keys(searchResults as object).length > 0 &&
      getArtist(searchResults.artists.items[0].id);
  }, [searchResults]);

  return (
    <div>
      <section className="grid grid-cols-2 gap-4 max-w-[1080px]">
        <div>
          <h2 className="text-2xl font-bold">Top result</h2>
          <div className="pt-8 pl-6 pb-6 rounded mt-7 bg-[#181818]">
            <img
              className=" rounded-[50%] h-28 w-28"
              src={
                Object.keys(artistInfo).length > 0 && artistInfo.images[0].url
              }
              alt="Artist Profile Picture"
            />
            <p className="text-[32px] font-medium mt-3">
              {Object.keys(artistInfo).length > 0 && artistInfo.name}
            </p>
            <span className="uppercase text-sm ml-2">ARTIST</span>
          </div>
        </div>
        <div>
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-medium">Songs</h2>
              </div>

              <div>
                <button className="uppercase text-xs text-[#b3b3b3] tracking-wider">
                  See all
                </button>
              </div>
            </div>
          </div>
          <div className="mt-9">
            {searchResults.tracks.items.slice(0, 4).map((song: any) => (
              <div
                onClick={() => playSong(song)}
                key={song.id}
                className={`${searchStyles.searchSongIndividual} group flex w-full group text-[#b3b3b3] hover:text-white hover:bg-[#282828] rounded-sm  cursor-pointer`}
              >
                <div className="flex py-1.5 pr-1.5 w-full">
                  <div className="ml-2 relative">
                    <img
                      className="w-11 group-hover:opacity-30 rounded-sm h-auto"
                      src={song?.album?.images[0]?.url}
                      alt={song?.album?.name}
                    />
                    <div className={`${searchStyles.searchPlayButtton} `}>
                      <svg
                        height={22}
                        width={22}
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon
                          fill="white"
                          points="21.57 12 5.98 3 5.98 21 21.57 12"
                        ></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between content-center items-center w-full">
                    <div className="flex flex-col ml-3.5 ">
                      <p className="text-white">{song.name}</p>
                      <p>{song.artists[0].name}</p>
                    </div>
                    <div>
                      <p>{milliSecondsToMinutesAndSeconds(song.duration_ms)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Artists</h2>
        <div
          className={`mt-6 grid grid-flow-col auto-cols-max auto-rows-max gap-4 overflow-y-hidden scrollbar-hide`}
        >
          {Object.keys(searchResults as object).length > 0 &&
            searchResults?.artists.items.map((artist: any) => (
              <div
                key={artist.id}
                onClick={() => handleSelectArtist(artist.id)}
                className=" hover:bg-[#282828] cursor-pointer rounded-md p-2 pb-6"
              >
                <img
                  className="rounded-full h-[190px] w-full p-2"
                  src={artist?.images[0]?.url}
                  alt="Artist profile picture"
                />

                <div className="ml-2 mt-1.5">
                  <p className="text-white hover:underline truncate">
                    {artist.name}
                  </p>
                  <p className="mt-0.5 text-[#b3b3b3] text-sm truncate">
                    Artist
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Albums</h2>
        <div
          className={`mt-6 grid grid-flow-col auto-cols-max auto-rows-max gap-4 overflow-y-hidden scrollbar-hide`}
        >
          {Object.keys(searchResults as object).length > 0 &&
            searchResults?.albums.items.map((album: any) => (
              <div
                onClick={() => handleSelectAlbum(album.id)}
                key={album.id}
                className=" hover:bg-[#282828] cursor-pointer rounded-md p-2 pb-6"
              >
                <img
                  className="rounded-md h-[190px] w-full p-2"
                  src={album.images[0].url}
                  alt="Artist profile picture"
                />

                <div className="ml-2 mt-1.5">
                  <p className="text-white hover:underline truncate">
                    {album.name}
                  </p>
                  <p className="mt-0.5 text-[#b3b3b3] text-sm truncate">
                    {album.release_date} • {album.artists[0].name}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Playlists</h2>
        <div
          className={`mt-6 grid grid-flow-col auto-cols-max auto-rows-max gap-4 overflow-y-hidden scrollbar-hide`}
        >
          {Object.keys(searchResults as object).length > 0 &&
            searchResults?.playlists.items.map((playlist: any) => (
              <div
                onClick={() => handleSelectPlaylist(playlist.id)}
                key={playlist.id}
                className=" hover:bg-[#282828] cursor-pointer rounded-md p-2 pb-6"
              >
                <img
                  className="rounded-lg h-[190px] w-full p-2"
                  src={playlist.images[0].url}
                  alt="Playlist profile picture"
                />

                <div className="ml-2 mt-1.5">
                  <p className="text-white hover:underline truncate">
                    {playlist.name}
                  </p>
                  <p className="mt-0.5 text-[#b3b3b3] text-sm truncate">
                    {playlist.owner.display_name}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section className="mt-10 pb-28">
        <h2 className="text-2xl font-bold">Podcasts</h2>
        <div
          className={`mt-6 grid grid-flow-col auto-cols-max auto-rows-max gap-4 overflow-y-hidden scrollbar-hide`}
        >
          {Object.keys(searchResults as object).length > 0 &&
            searchResults?.shows.items.map((podcast: any) => (
              <div
                key={podcast.id}
                onClick={() => handleSelectPodcast(podcast.id)}
                className=" hover:bg-[#282828] cursor-pointer rounded-md p-2 pb-6"
              >
                <img
                  className="rounded-lg h-[190px] w-full p-2"
                  src={podcast.images[0].url}
                  alt="Playlist profile picture"
                />

                <div className="ml-2 mt-1.5">
                  <p className="text-white hover:underline truncate">
                    {podcast.name}
                  </p>
                  <p className="mt-0.5 text-[#b3b3b3] text-sm truncate">
                    {podcast.publisher}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

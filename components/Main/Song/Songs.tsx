import React from "react";
import { useAppStore } from "../../../store/AppStore";
import { Song } from "./Song";

interface SongsProps {}

export const Songs: React.FC<SongsProps> = ({}) => {
  const { selectedPlaylist, setSelectedPlaylist } = useAppStore();
  return (
    <div className="px-6 flex flex-col mt-3 space-y-2 pb-28 text-white">
      {selectedPlaylist?.tracks.items.map((song: any, i: number) => (
        <Song key={song.track.id} song={song} order={i} />
      ))}
    </div>
  );
};

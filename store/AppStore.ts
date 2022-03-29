import create from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  userPlaylists: any[];
  setUserPlaylists: (playlists: any[]) => void;
  selectedPlaylistId: string | undefined;
  setSelectedPlaylistId: (id: string) => void;
  selectedPlaylist: any;
  setSelectedPlaylist: (playlist: any) => void;
  currentTrackId: string | undefined;
  setCurrentTrackId: (id: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playlist: boolean) => void;
}

export const useAppStore = create<State>(
  devtools((set) => ({
    userPlaylists: [],
    setUserPlaylists: (playlist) =>
      set((state) => ({ userPlaylists: playlist })),
    selectedPlaylistId: undefined,
    setSelectedPlaylistId: (id) => set((state) => ({ selectedPlaylistId: id })),
    selectedPlaylist: undefined,
    setSelectedPlaylist: (playlist) =>
      set((state) => ({ selectedPlaylist: playlist })),
    currentTrackId: undefined,
    setCurrentTrackId: (id) => set((state) => ({ currentTrackId: id })),
    isPlaying: false,
    setIsPlaying: (value) => set((state) => ({ isPlaying: value })),
  }))
);

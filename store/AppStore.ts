import create from "zustand";

interface State {
  selectedPlaylistId: string | undefined;
  setSelectedPlaylistId: (id: string) => void;
  selectedPlaylist: any;
  setSelectedPlaylist: (playlist: any) => void;
}

export const useAppStore = create<State>(set => ({
  selectedPlaylistId: undefined,
  setSelectedPlaylistId: (id) =>
    set((state) => ({ selectedPlaylistId: id })),
  selectedPlaylist: undefined,
  setSelectedPlaylist: (playlist) => set((state) => ({ selectedPlaylist: playlist })),
}));

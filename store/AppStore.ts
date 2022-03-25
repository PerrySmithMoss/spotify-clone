import create from "zustand";

interface State {
  userPlaylists: any[];
  setUserPlaylists: (playlists: any[]) => void;
  selectedPlaylistId: string | undefined;
  setSelectedPlaylistId: (id: string) => void;
  selectedPlaylist: any;
  setSelectedPlaylist: (playlist: any) => void;
}

export const useAppStore = create<State>((set) => ({
  userPlaylists: [],
  setUserPlaylists: (playlist) => set((state) => ({ userPlaylists: playlist })),
  selectedPlaylistId: undefined,
  setSelectedPlaylistId: (id) => set((state) => ({ selectedPlaylistId: id })),
  selectedPlaylist: undefined,
  setSelectedPlaylist: (playlist) =>
    set((state) => ({ selectedPlaylist: playlist })),
}));

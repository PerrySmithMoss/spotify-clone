import create from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  isProfileDrodownOpen: boolean;
  setIsProfileDrodownOpen: (prev: boolean) => void;
  userPlaylists: any[];
  setUserPlaylists: (playlists: any[]) => void;
  selectedPlaylistId: string | undefined;
  setSelectedPlaylistId: (id: string) => void;
  selectedPlaylist: any;
  setSelectedPlaylist: (playlist: any) => void;
  currentTrackId: string | undefined;
  setCurrentTrackId: (id: string) => void;
  selectedArtistId: string | undefined;
  setSelectedArtistId: (id: string) => void;
  selectedAlbumId: string | undefined;
  setSelectedAlbumId: (id: string) => void;
  selectedPodcastId: string | undefined;
  setSelectedPodcastId: (id: string) => void;
  selectedPodcast: any;
  setSelectedPodcast: (podcast: any) => void;
  selectedArtist: any;
  setSelectedArtist: (artist: any) => void;
  selectedAlbum: any;
  setSelectedAlbum: (album: any) => void;
  isPlaying: boolean;
  setIsPlaying: (prev: boolean) => void;
  libraryCollectionSelected: "playlists" | "podcasts" | "artists" | "albums";
  setLibraryCollectionSelected: (
    prev: "playlists" | "podcasts" | "artists" | "albums"
  ) => void;
}

export const useAppStore = create<State>(
  devtools((set) => ({
    isProfileDrodownOpen: false,
    setIsProfileDrodownOpen: (value) =>
      set((state) => ({ isProfileDrodownOpen: value })),
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
    selectedArtistId: undefined,
    setSelectedArtistId: (id) => set((state) => ({ selectedArtistId: id })),
    selectedArtist: undefined,
    setSelectedArtist: (artist) => set((state) => ({ selectedArtist: artist })),
    selectedAlbumId: undefined,
    setSelectedAlbumId: (id) => set((state) => ({ selectedAlbumId: id })),
    selectedPodcastId: undefined,
    setSelectedPodcastId: (id) => set((state) => ({ selectedPodcastId: id })),
    selectedPodcast: undefined,
    setSelectedPodcast: (podcast) =>
      set((state) => ({ selectedPodcast: podcast })),
    selectedAlbum: undefined,
    setSelectedAlbum: (album) => set((state) => ({ selectedAlbum: album })),
    isPlaying: false,
    setIsPlaying: (value) => set((state) => ({ isPlaying: value })),
    libraryCollectionSelected: "playlists",
    setLibraryCollectionSelected: (value) =>
      set((state) => ({ libraryCollectionSelected: value })),
  }))
);

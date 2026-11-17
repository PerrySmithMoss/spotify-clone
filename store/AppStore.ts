import { create } from "zustand";
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
  playbackError: string | undefined;
  setPlaybackError: (error: string | undefined) => void;
  isPlaybackPending: boolean;
  setPlaybackPending: (pending: boolean) => void;
  libraryCollectionSelected:
    "playlists" | "podcasts" | "artists" | "albums" | "tracks";
  setLibraryCollectionSelected: (
    prev: "playlists" | "podcasts" | "artists" | "albums" | "tracks",
  ) => void;
}

export const useAppStore = create<State>()(
  devtools((set) => ({
    isProfileDrodownOpen: false,
    setIsProfileDrodownOpen: (value) =>
      set(() => ({ isProfileDrodownOpen: value })),
    userPlaylists: [],
    setUserPlaylists: (playlist) => set(() => ({ userPlaylists: playlist })),
    selectedPlaylistId: undefined,
    setSelectedPlaylistId: (id) => set(() => ({ selectedPlaylistId: id })),
    selectedPlaylist: undefined,
    setSelectedPlaylist: (playlist) =>
      set(() => ({ selectedPlaylist: playlist })),
    currentTrackId: undefined,
    setCurrentTrackId: (id) => set(() => ({ currentTrackId: id })),
    selectedArtistId: undefined,
    setSelectedArtistId: (id) => set(() => ({ selectedArtistId: id })),
    selectedArtist: undefined,
    setSelectedArtist: (artist) => set(() => ({ selectedArtist: artist })),
    selectedAlbumId: undefined,
    setSelectedAlbumId: (id) => set(() => ({ selectedAlbumId: id })),
    selectedPodcastId: undefined,
    setSelectedPodcastId: (id) => set(() => ({ selectedPodcastId: id })),
    selectedPodcast: undefined,
    setSelectedPodcast: (podcast) => set(() => ({ selectedPodcast: podcast })),
    selectedAlbum: undefined,
    setSelectedAlbum: (album) => set(() => ({ selectedAlbum: album })),
    isPlaying: false,
    setIsPlaying: (value) => set(() => ({ isPlaying: value })),
    playbackError: undefined,
    setPlaybackError: (error) => set(() => ({ playbackError: error })),
    isPlaybackPending: false,
    setPlaybackPending: (pending) =>
      set(() => ({ isPlaybackPending: pending })),
    libraryCollectionSelected: "playlists",
    setLibraryCollectionSelected: (value) =>
      set(() => ({ libraryCollectionSelected: value })),
  })),
);

import SpotifyWebApi from "spotify-web-api-node";

// Browser clients receive only a short-lived access token from their session.
export const createSpotifyClient = () => new SpotifyWebApi();

export function milliSecondsToMinutesAndSeconds(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

  return parseInt(seconds) == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
}

export function milliSecondsToMinutesAndSeconds(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

  return parseInt(seconds) == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
}

export function milliSecondsToHours(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return hours;
}

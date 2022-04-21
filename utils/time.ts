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

export function milliSecondsToHoursMinutesAndSeconds(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  const hours = Math.floor(minutes / 60);

  return parseInt(seconds) == 60
    ? minutes + 1 + ":00"
    : hours === 0
    ? minutes + " minutes " + (parseInt(seconds) < 10 ? "0" : "") + seconds
    : hours +
      " hr " +
      minutes +
      " minutes " +
      (parseInt(seconds) < 10 ? "0" : "") +
      seconds;
}

export function milliSecondsToHoursAndMinutes(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  const hours = Math.floor(minutes / 60);

  return parseInt(seconds) == 60
    ? minutes + 1 + ":00"
    : hours === 0
    ? minutes + " minutes " + (parseInt(seconds) < 10 ? "0" : "") + seconds
    : hours +
      " hr " +
      minutes +
      " minutes " +
      (parseInt(seconds) < 10 ? "0" : "") +
      seconds;
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

export function convertMsToHM(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  // 👇️ if seconds are greater than 30, round minutes up (optional)
  minutes = seconds >= 30 ? minutes + 1 : minutes;

  minutes = minutes % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
  hours = hours % 24;

  return `${hours}hr${padTo2Digits(minutes)}min`;
}
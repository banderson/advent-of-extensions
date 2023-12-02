export const millisecondsInOneSecond = 1000;
const secondsPerMinute = 60;
const secondsPerHour = secondsPerMinute * 60;
const secondsPerDay = secondsPerHour * 24;

export const getDiff = (from, to) => {
  let delta = (to.getTime() - from.getTime()) / millisecondsInOneSecond;

  const days = Math.floor(delta / secondsPerDay);
  delta -= days * secondsPerDay;

  const hours = Math.floor(delta / secondsPerHour);
  delta -= hours * secondsPerHour;

  const minutes = Math.floor(delta / secondsPerMinute);
  delta -= minutes * secondsPerMinute;

  const seconds = Math.floor(delta);

  return { days, hours, minutes, seconds };
};
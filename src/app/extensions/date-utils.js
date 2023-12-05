export const millisecondsInOneSecond = 1000;
const secondsPerMinute = 60;
const secondsPerHour = secondsPerMinute * 60;
const secondsPerDay = secondsPerHour * 24;
const CHRISTMAS = new Date(2023, 11, 25);

export const getDiff = (from = new Date(), to = CHRISTMAS) => {
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

export const getCalendarWeeks = (
  month = new Date().getMonth(),
  year = new Date().getFullYear()
) => {
  const firstDayOffset = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate() + 1;
  const daysPerWeek = 7;

  const introSpacers = firstDayOffset;
  const outroSpacers =
    daysPerWeek - ((firstDayOffset + totalDays) % daysPerWeek);

  let arraySize = introSpacers + totalDays + outroSpacers;
  // arraySize += daysPerWeek - (arraySize % daysPerWeek);

  const days = new Array(arraySize).fill("").map((value, i) => {
    if (i < firstDayOffset || i >= firstDayOffset + totalDays) {
      return value;
    }

    return i + 1 - firstDayOffset;
  });

  let weeks = [];
  for (let i = 0; i < days.length; i += daysPerWeek) {
    weeks.push(days.slice(i, i + daysPerWeek));
  }

  return weeks;
};

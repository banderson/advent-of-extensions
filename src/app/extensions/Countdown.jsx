import React, { useEffect, useState } from "react";
import { Statistics, StatisticsItem, hubspot } from "@hubspot/ui-extensions";

const CHRISTMAS = new Date(2023, 11, 25);
const millisecondsInOneSecond = 1000;
const secondsPerMinute = 60;
const secondsPerHour = secondsPerMinute * 60;
const secondsPerDay = secondsPerHour * 24;

const getDiff = (from, to) => {
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

const Extension = () => {
  const [countdown, setCountdown] = useState(getDiff(new Date(), CHRISTMAS));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getDiff(new Date(), CHRISTMAS));
    }, millisecondsInOneSecond);

    return () => {
      clearInterval(interval);
    };
  });

  const { days, hours, minutes, seconds } = countdown;

  return (
    <>
      <Statistics>
        <StatisticsItem label="Days" number={days} />
        <StatisticsItem label="Hours" number={hours} />
        <StatisticsItem label="Minutes" number={minutes} />
        <StatisticsItem label="Seconds" number={seconds} />
      </Statistics>
    </>
  );
};

hubspot.extend(() => <Extension />);

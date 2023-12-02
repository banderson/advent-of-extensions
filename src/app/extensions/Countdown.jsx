import React, { useEffect, useState } from "react";
import { Statistics, StatisticsItem, hubspot } from "@hubspot/ui-extensions";
import { getDiff, millisecondsInOneSecond } from "./date-utils";

const CHRISTMAS = new Date(2023, 11, 25);

const Extension = () => {
  const [countdown, setCountdown] = useState(getDiff(new Date(), CHRISTMAS));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getDiff(new Date(), CHRISTMAS));
    }, millisecondsInOneSecond);

    return () => {
      clearInterval(interval);
    };
  }, []);

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

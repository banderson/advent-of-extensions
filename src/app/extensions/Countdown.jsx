import React, { useEffect, useState } from "react";
import { Statistics, StatisticsItem, hubspot } from "@hubspot/ui-extensions";
import { getDiff, millisecondsInOneSecond } from "./date-utils";

const Extension = () => {
  const [countdown, setCountdown] = useState(getDiff());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getDiff());
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

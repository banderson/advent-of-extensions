import React from "react";
import { hubspot, Statistics, StatisticsItem } from "@hubspot/ui-extensions";
import { getDiff } from "./date-utils";

const Extension = () => {
  return (
    <Statistics>
      <StatisticsItem number={getDiff().days} />
    </Statistics>
  );
};

hubspot.extend(() => <Extension />);

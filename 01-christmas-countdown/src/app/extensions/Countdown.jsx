import React, { useState } from "react";
import { Text, hubspot } from "@hubspot/ui-extensions";

hubspot.extend(() => <Extension />);

const Extension = () => {
  return (
    <>
      <Text format={{ fontWeight: "bold" }}>
        Coming soon: Christmas Countdown!
      </Text>
    </>
  );
};
